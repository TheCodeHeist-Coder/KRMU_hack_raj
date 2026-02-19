import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'employee' | 'icc' | 'admin';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    role: UserRole;
    organizationId: mongoose.Types.ObjectId;
    displayName?: string;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['employee', 'icc', 'admin'], required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    displayName: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
