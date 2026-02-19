import mongoose, { Document, Schema } from 'mongoose';

export type ComplaintStatus = 'Submitted' | 'Under Review' | 'Inquiry' | 'Resolved' | 'Closed';
export type SeverityLevel = 'Low' | 'Medium' | 'High';
export type IncidentType =
    | 'Sexual Harassment'
    | 'Verbal Abuse'
    | 'Physical Harassment'
    | 'Cyber Harassment'
    | 'Discrimination'
    | 'Hostile Work Environment'
    | 'Retaliation'
    | 'Other';

export interface IComplaint extends Document {
    organizationId: mongoose.Types.ObjectId;
    caseId: string;
    pinHash: string;
    isAnonymous: boolean;
    reporterUserId?: mongoose.Types.ObjectId;
    incidentType: IncidentType;
    incidentDate: string;
    incidentTime?: string;
    location: string;
    description: string;
    accusedRole: string;
    accusedDepartment?: string;
    status: ComplaintStatus;
    severityLevel: SeverityLevel;
    internalNotes?: string;
    assignedTo?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>({
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    caseId: { type: String, required: true, unique: true },
    pinHash: { type: String, required: true },
    isAnonymous: { type: Boolean, default: true },
    reporterUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    incidentType: { type: String, required: true },
    incidentDate: { type: String, required: true },
    incidentTime: { type: String },
    location: { type: String, required: true },
    description: { type: String, required: true },
    accusedRole: { type: String, required: true },
    accusedDepartment: { type: String },
    status: {
        type: String,
        enum: ['Submitted', 'Under Review', 'Inquiry', 'Resolved', 'Closed'],
        default: 'Submitted',
    },
    severityLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    internalNotes: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

ComplaintSchema.index({ organizationId: 1, createdAt: -1 });

export default mongoose.model<IComplaint>('Complaint', ComplaintSchema);
