import mongoose, { Document, Schema } from 'mongoose';

export interface IEvidence extends Document {
    complaintId: mongoose.Types.ObjectId;
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: Date;
    aiIsReal?: boolean;
    aiScore?: number;
    aiDetails?: Record<string, unknown>;
    aiRatedAt?: Date;
}

const EvidenceSchema = new Schema<IEvidence>({
    complaintId: { type: Schema.Types.ObjectId, ref: 'Complaint', required: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    aiIsReal: { type: Boolean },
    aiScore: { type: Number },
    aiDetails: { type: Schema.Types.Mixed },
    aiRatedAt: { type: Date },
}, { timestamps: { createdAt: 'uploadedAt', updatedAt: false } });

EvidenceSchema.index({ complaintId: 1 });

export default mongoose.model<IEvidence>('Evidence', EvidenceSchema);
