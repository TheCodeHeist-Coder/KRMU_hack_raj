import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Complaint from '../models/Complaint';
import AuditLog from '../models/AuditLog';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// All admin routes require admin role
router.use(authenticate, requireRole('admin'));

// GET /api/admin/stats — Compliance statistics
router.get('/stats', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const orgId = req.user!.organizationId;
        const complaints = await Complaint.find({ organizationId: orgId });

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const byStatus: Record<string, number> = {
            'Submitted': 0, 'Under Review': 0, 'Inquiry': 0, 'Resolved': 0, 'Closed': 0,
        };
        const bySeverity: Record<string, number> = { Low: 0, Medium: 0, High: 0 };
        let resolvedThisMonth = 0;
        let pendingComplaints = 0;

        for (const c of complaints) {
            byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
            bySeverity[c.severityLevel] = (bySeverity[c.severityLevel] ?? 0) + 1;
            if (['Resolved', 'Closed'].includes(c.status) && c.updatedAt >= startOfMonth) {
                resolvedThisMonth++;
            }
            if (['Submitted', 'Under Review', 'Inquiry'].includes(c.status)) {
                pendingComplaints++;
            }
        }

        res.json({
            totalComplaints: complaints.length,
            byStatus,
            bySeverity,
            resolvedThisMonth,
            pendingComplaints,
        });
    } catch {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// GET /api/admin/members — List ICC members
router.get('/members', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const members = await User.find(
            { organizationId: req.user!.organizationId, role: { $in: ['icc', 'admin'] } },
            { passwordHash: 0 }
        ).sort({ createdAt: -1 });
        res.json(members);
    } catch {
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

// POST /api/admin/members — Add ICC member
router.post('/members', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password, role, displayName } = req.body;
        if (!email || !password || !role) {
            res.status(400).json({ error: 'Email, password, and role are required' });
            return;
        }
        if (!['icc', 'admin'].includes(role)) {
            res.status(400).json({ error: 'Role must be icc or admin' });
            return;
        }
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            res.status(409).json({ error: 'Email already exists' });
            return;
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({
            email: email.toLowerCase(),
            passwordHash,
            role,
            organizationId: req.user!.organizationId,
            displayName,
        });

        await AuditLog.create({
            action: 'MEMBER_ADDED',
            userId: req.user!._id,
            details: { email, role },
        });

        res.status(201).json({
            id: user._id,
            email: user.email,
            role: user.role,
            displayName: user.displayName,
        });
    } catch {
        res.status(500).json({ error: 'Failed to add member' });
    }
});

// DELETE /api/admin/members/:id — Remove ICC member
router.delete('/members/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.params.id === String(req.user!._id)) {
            res.status(400).json({ error: 'Cannot delete your own account' });
            return;
        }
        await User.findOneAndDelete({
            _id: req.params.id,
            organizationId: req.user!.organizationId,
        });
        res.json({ message: 'Member removed' });
    } catch {
        res.status(500).json({ error: 'Failed to remove member' });
    }
});

export default router;
