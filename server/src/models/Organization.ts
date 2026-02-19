import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
    name: string;
    domain?: string;
    createdAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>({
    name: { type: String, required: true },
    domain: { type: String },
}, { timestamps: true });

export default mongoose.model<IOrganization>('Organization', OrganizationSchema);
