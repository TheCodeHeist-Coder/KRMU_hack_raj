import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';
import Organization from '../src/models/Organization';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ?? '';

async function main() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);

  let org = await Organization.findOne({ name: 'SafeDesk Demo Org' });
  if (!org) {
    org = await Organization.create({ name: 'SafeDesk Demo Org', domain: 'safedesk.com' });
    console.log('Created org', org._id);
  }

  const hashed = await bcrypt.hash('admin123', 12);
  const updated = await User.findOneAndUpdate(
    { email: 'admin@safedesk.com' },
    { $set: { passwordHash: hashed, role: 'admin', displayName: 'System Admin', organizationId: org._id } },
    { new: true }
  ).lean();

  if (!updated) {
    console.log('Admin user not found; creating new admin.');
    const created = await User.create({ email: 'admin@safedesk.com', passwordHash: hashed, role: 'admin', organizationId: org._id, displayName: 'System Admin' });
    console.log('Created admin:', { id: created._id, email: created.email });
  } else {
    console.log('Updated admin:', { id: updated._id, email: updated.email, role: updated.role });
  }
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
