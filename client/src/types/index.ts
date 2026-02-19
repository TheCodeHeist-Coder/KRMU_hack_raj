// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'employee' | 'icc' | 'admin';
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

export interface User {
    id: string;
    email: string;
    role: UserRole;
    organizationId: string;
    displayName?: string;
}

export interface Complaint {
    _id: string;
    organizationId: string;
    caseId: string;
    isAnonymous: boolean;
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
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    _id: string;
    complaintId: string;
    senderRole: 'employee' | 'icc';
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface Evidence {
    _id: string;
    complaintId: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
}

export interface ComplianceStats {
    totalComplaints: number;
    byStatus: Record<ComplaintStatus, number>;
    bySeverity: Record<SeverityLevel, number>;
    resolvedThisMonth: number;
    pendingComplaints: number;
}

export interface SubmitComplaintResponse {
    caseId: string;
    pin: string;
    complaintId: string;
}

export interface AIImproveResponse {
    improvedText: string;
    detectedSeverity: SeverityLevel;
    guidanceMessage: string;
}
