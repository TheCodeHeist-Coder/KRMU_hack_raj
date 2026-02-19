import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ?? '';

async function main() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  const user = await User.findOne({ email: 'admin@safedesk.com' }).lean();
  if (!user) {
    console.log('Admin user not found');
    process.exit(0);
  }
  console.log('Admin user:', { id: user._id, email: user.email, role: user.role, displayName: user.displayName });

  const bcrypt = await import('bcryptjs');
  const valid = await bcrypt.compare('admin123', (user as any).passwordHash);
  console.log('Password valid for admin123:', valid);
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
