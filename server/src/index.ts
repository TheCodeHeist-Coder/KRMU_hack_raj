import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import complaintRoutes from './routes/complaints';
import evidenceRoutes from './routes/evidence';
import aiRoutes from './routes/ai';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR ?? 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb+srv://shivang2435_db_user:5br6kPS9crxq7NfN@cluster0.ryp8zit.mongodb.net/imaraj');
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => console.log(`🚀 SafeDesk server running on http://localhost:${PORT}`));
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}

start();
