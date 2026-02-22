import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Evidence from '../models/Evidence';
import AuditLog from '../models/AuditLog';
import Message from '../models/Message';
import { analyzeImage } from '../services/aiChecker';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Configure multer storage
const uploadDir = process.env.UPLOAD_DIR ?? 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: Number(process.env.MAX_FILE_SIZE_MB ?? 10) * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp4|mov/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext || mime) cb(null, true);
        else cb(new Error('File type not allowed'));
    },
});

// POST /api/evidence/:complaintId — Upload evidence file
router.post('/:complaintId', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        const evidence = await Evidence.create({
            complaintId: req.params.complaintId,
            fileUrl,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
        });

        // If it's an image, analyze it asynchronously (if model configured)
        if (req.file.mimetype.startsWith('image/')) {
            (async () => {
                try {
                    const uploadedPath = path.join(uploadDir, req.file.filename);
                    const result = await analyzeImage(uploadedPath);
                    if (!result) {
                        // AI service not configured or failed — log for visibility
                        // eslint-disable-next-line no-console
                        console.warn('AI service returned no result for', uploadedPath);
                        return;
                    }

                    console.log("result is:", result);

                
                    const flagged = result.isAI === true || (typeof result.aiScore === 'number' && result.aiScore < 0.5);
                    if (flagged) {
                        await AuditLog.create({
                            action: 'EVIDENCE_FLAGGED',
                            complaintId: evidence.complaintId,
                            details: { evidenceId: evidence._id, fileName: evidence.fileName, aiScore: result.aiScore, aiDetails: result.aiDetails },
                        });

                        // Create a message for ICC members to review — senderRole 'icc' so it appears in ICC chat
                        await Message.create({
                            complaintId: evidence.complaintId,
                            senderRole: 'icc',
                            message: `AI flagged uploaded evidence '${evidence.fileName}' as potentially manipulated.}`,
                        });
                    }else{
                         await Message.create({
                            complaintId: evidence.complaintId,
                            senderRole: 'icc',
                            message: `I think, this uploaded image '${evidence.fileName}' is genuine .But you should check it once.}`,
                        });
                    }
                } catch (err) {
                    // ignore AI failures
                    // eslint-disable-next-line no-console
                    console.error('Failed to save AI result', err?.message ?? err);
                }
            })();
        }
        res.status(201).json(evidence);
    } catch (err) {
        res.status(500).json({ error: 'Upload failed' });
    }
});

// GET /api/evidence/:complaintId — List evidence (ICC only)
router.get('/:complaintId', authenticate, requireRole('icc', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const evidence = await Evidence.find({ complaintId: req.params.complaintId }).sort({ uploadedAt: 1 });
        res.json(evidence);
    } catch {
        res.status(500).json({ error: 'Failed to fetch evidence' });
    }
});

export default router;
