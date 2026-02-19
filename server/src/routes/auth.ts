import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Organization from '../models/Organization';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET as jwt.Secret,
            { expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'] }
        );
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                organizationId: user.organizationId,
                displayName: user.displayName,
            },
        });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    const user = req.user!;
    res.json({
        id: user._id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        displayName: user.displayName,
    });
});

export default router;
