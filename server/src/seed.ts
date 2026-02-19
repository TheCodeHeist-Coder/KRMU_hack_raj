
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Organization from './models/Organization';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI is not defined in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if organization exists
        let org = await Organization.findOne({ name: 'SafeDesk Demo Org' });
        if (!org) {
            org = await Organization.create({
                name: 'SafeDesk Demo Org',
                domain: 'safedesk.com',
            });
            console.log('✅ Created Organization:', org.name);
        } else {
            console.log('ℹ️ Organization already exists:', org.name);
        }

        // Check if admin exists
        const adminEmail = 'admin@safedesk.com';
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin123', 12);
            admin = await User.create({
                email: adminEmail,
                passwordHash: hashedPassword,
                role: 'admin',
                organizationId: org._id,
                displayName: 'System Admin',
            });
            console.log('✅ Created Admin User:', admin.email);
        } else {
            console.log('ℹ️ Admin User already exists:', admin.email);
        }

        // Check if ICC member exists
        const iccEmail = 'icc@safedesk.com';
        let icc = await User.findOne({ email: iccEmail });
        if (!icc) {
            const hashedPassword = await bcrypt.hash('icc123', 12);
            icc = await User.create({
                email: iccEmail,
                passwordHash: hashedPassword,
                role: 'icc',
                organizationId: org._id,
                displayName: 'ICC Chairperson',
            });
            console.log('✅ Created ICC User:', icc.email);
        } else {
            console.log('ℹ️ ICC User already exists:', icc.email);
        }

        console.log('\n🎉 Seeding complete!');
        console.log('-----------------------------------');
        console.log('Admin Login: admin@safedesk.com / admin123');
        console.log('ICC Login:   icc@safedesk.com   / icc123');
        console.log('-----------------------------------');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
