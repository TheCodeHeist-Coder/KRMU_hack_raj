import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: string | Date): string {
    return format(new Date(date), 'dd MMM yyyy');
}

export function formatDateTime(date: string | Date): string {
    return format(new Date(date), 'dd MMM yyyy, hh:mm a');
}

export function formatRelative(date: string | Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getStatusColor(status: string): string {
    const map: Record<string, string> = {
        'Submitted': 'bg-blue-100 text-blue-700 border-blue-200',
        'Under Review': 'bg-purple-100 text-purple-700 border-purple-200',
        'Inquiry': 'bg-amber-100 text-amber-700 border-amber-200',
        'Resolved': 'bg-green-100 text-green-700 border-green-200',
        'Closed': 'bg-gray-100 text-gray-600 border-gray-200',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
}

export function getSeverityColor(severity: string): string {
    const map: Record<string, string> = {
        'High': 'bg-red-100 text-red-700 border-red-200',
        'Medium': 'bg-amber-100 text-amber-700 border-amber-200',
        'Low': 'bg-green-100 text-green-700 border-green-200',
    };
    return map[severity] ?? 'bg-gray-100 text-gray-600 border-gray-200';
}

export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function sanitize(input: string): string {
    return input.trim().replace(/<[^>]*>/g, '');
}
