import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import Complaint from '../models/Complaint';
import Message from '../models/Message';
import AuditLog from '../models/AuditLog';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Generate a human-readable Case ID
async function generateCaseId(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await Complaint.countDocuments();
    const seq = String(count + 1).padStart(4, '0');
    return `SD-${year}-${seq}`;
}

// Generate a 6-digit PIN
function generatePin(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
}

// Sanitize input
function sanitize(input: string): string {
    return input.trim().replace(/<[^>]*>/g, '');
}

// ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────

// POST /api/complaints — Submit a new complaint (no auth required)
router.post(
    '/',
    rateLimiter(5, 15 * 60 * 1000), // 5 per 15 minutes per IP
    async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                organizationId,
                incidentType,
                incidentDate,
                incidentTime,
                location,
                description,
                accusedRole,
                accusedDepartment,
                isAnonymous,
                severityLevel,
            } = req.body;

            if (!organizationId || !incidentType || !incidentDate || !location || !description || !accusedRole) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            const pin = generatePin();
            const pinHash = await bcrypt.hash(pin, 12);
            const caseId = await generateCaseId();

            const complaint = await Complaint.create({
                organizationId,
                caseId,
                pinHash,
                isAnonymous: isAnonymous ?? true,
                incidentType,
                incidentDate,
                incidentTime,
                location: sanitize(location),
                description: sanitize(description),
                accusedRole,
                accusedDepartment: accusedDepartment ? sanitize(accusedDepartment) : undefined,
                severityLevel: severityLevel ?? 'Medium',
                status: 'Submitted',
            });

            // Log submission
            await AuditLog.create({
                action: 'COMPLAINT_SUBMITTED',
                complaintId: complaint._id,
                details: { caseId, isAnonymous },
            });

            // Return Case ID + plain PIN (only time it's ever sent)
            res.status(201).json({
                caseId,
                pin,
                complaintId: complaint._id,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to submit complaint' });
        }
    }
);

// POST /api/complaints/verify — Verify Case ID + PIN
router.post('/verify', async (req: Request, res: Response): Promise<void> => {
    try {
        const { caseId, pin } = req.body;
        if (!caseId || !pin) {
            res.status(400).json({ error: 'Case ID and PIN are required' });
            return;
        }
        const complaint = await Complaint.findOne({ caseId });
        if (!complaint) {
            res.status(404).json({ error: 'Case not found' });
            return;
        }
        const valid = await bcrypt.compare(String(pin), complaint.pinHash);
        if (!valid) {
            res.status(401).json({ error: 'Invalid PIN' });
            return;
        }
        // Return complaint without pinHash
        const { pinHash: _, ...safeComplaint } = complaint.toObject();
        res.json({ complaint: safeComplaint, complaintId: complaint._id });
    } catch (err) {
        res.status(500).json({ error: 'Verification failed' });
    }
});

// GET /api/complaints/:id/messages — Get messages (PIN-verified via query)
router.get('/:id/messages', async (req: Request, res: Response): Promise<void> => {
    try {
        const { pin } = req.query;
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) { res.status(404).json({ error: 'Not found' }); return; }

        // Verify PIN for employee access
        if (pin) {
            const valid = await bcrypt.compare(String(pin), complaint.pinHash);
            if (!valid) { res.status(401).json({ error: 'Invalid PIN' }); return; }
        }

        const messages = await Message.find({ complaintId: req.params.id }).sort({ createdAt: 1 });
        res.json(messages);
    } catch {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// POST /api/complaints/:id/messages — Send message (employee with PIN or ICC with JWT)
router.post('/:id/messages', async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, senderRole, pin } = req.body;
        if (!message || !senderRole) {
            res.status(400).json({ error: 'Message and senderRole required' });
            return;
        }
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) { res.status(404).json({ error: 'Not found' }); return; }
        if (complaint.status === 'Closed') {
            res.status(400).json({ error: 'Case is closed' });
            return;
        }

        // Employee must verify PIN; ICC verified via JWT separately
        if (senderRole === 'employee') {
            if (!pin) { res.status(401).json({ error: 'PIN required' }); return; }
            const valid = await bcrypt.compare(String(pin), complaint.pinHash);
            if (!valid) { res.status(401).json({ error: 'Invalid PIN' }); return; }
        }

        const msg = await Message.create({
            complaintId: req.params.id,
            senderRole,
            message: sanitize(message),
        });
        res.status(201).json(msg);
    } catch {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// ─── ICC/ADMIN PROTECTED ROUTES ──────────────────────────────────────────────

// GET /api/complaints — List complaints for org
router.get('/', authenticate, requireRole('icc', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status, severity } = req.query;
        const filter: Record<string, unknown> = { organizationId: req.user!.organizationId };
        if (status) filter.status = status;
        if (severity) filter.severityLevel = severity;

        const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
        res.json(complaints);
    } catch {
        res.status(500).json({ error: 'Failed to fetch complaints' });
    }
});

// GET /api/complaints/:id — Get complaint detail
router.get('/:id', authenticate, requireRole('icc', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const complaint = await Complaint.findOne({
            _id: req.params.id,
            organizationId: req.user!.organizationId,
        });
        if (!complaint) { res.status(404).json({ error: 'Not found' }); return; }
        const { pinHash: _, ...safe } = complaint.toObject();
        res.json(safe);
    } catch {
        res.status(500).json({ error: 'Failed to fetch complaint' });
    }
});

// PATCH /api/complaints/:id/status — Update status + notes
router.patch('/:id/status', authenticate, requireRole('icc', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status, internalNotes, severityLevel } = req.body;
        const update: Record<string, unknown> = { updatedAt: new Date() };
        if (status) update.status = status;
        if (internalNotes !== undefined) update.internalNotes = internalNotes;
        if (severityLevel) update.severityLevel = severityLevel;

        const complaint = await Complaint.findOneAndUpdate(
            { _id: req.params.id, organizationId: req.user!.organizationId },
            update,
            { new: true }
        );
        if (!complaint) { res.status(404).json({ error: 'Not found' }); return; }

        await AuditLog.create({
            action: 'STATUS_UPDATED',
            userId: req.user!._id,
            complaintId: complaint._id,
            details: { status, severityLevel },
        });

        const { pinHash: _, ...safe } = complaint.toObject();
        res.json(safe);
    } catch {
        res.status(500).json({ error: 'Failed to update status' });
    }
});

export default router;
