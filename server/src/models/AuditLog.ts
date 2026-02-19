import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
    action: string;
    userId?: mongoose.Types.ObjectId;
    complaintId?: mongoose.Types.ObjectId;
    details?: Record<string, unknown>;
    timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
    action: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    complaintId: { type: Schema.Types.ObjectId, ref: 'Complaint' },
    details: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
});

AuditLogSchema.index({ complaintId: 1, timestamp: 1 });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
