import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    complaintId: mongoose.Types.ObjectId;
    senderRole: 'employee' | 'icc';
    message: string;
    isRead: boolean;
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    complaintId: { type: Schema.Types.ObjectId, ref: 'Complaint', required: true },
    senderRole: { type: String, enum: ['employee', 'icc'], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

MessageSchema.index({ complaintId: 1, createdAt: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
