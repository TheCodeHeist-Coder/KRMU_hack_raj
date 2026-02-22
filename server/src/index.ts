import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import chatRoute from './routes/chat.js'
import emergencyRouter from './services/Emergency.js';
import complaintRoutes from './routes/complaints.js';
import evidenceRoutes from './routes/evidence.js';
import aiRoutes from './routes/ai.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

// Configure CORS to accept requests from the client dev server and any configured CLIENT_URL
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (origin === CLIENT_URL || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) return callback(null, true);
        // fallback: allow if exact match of CLIENT_URL
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR ?? 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', chatRoute)     // for the AI chatboat
app.use('/api', emergencyRouter); // for the emergency SOS service

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI ?? "");
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`SafeDesk server running on http://localhost:${PORT}`));
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}

start();
