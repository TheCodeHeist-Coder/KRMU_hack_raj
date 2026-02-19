import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Download, FileText, StickyNote, MessageSquare } from 'lucide-react';
import api from '../../lib/api';
import { formatDateTime, formatRelative, getStatusColor, getSeverityColor, formatFileSize } from '../../lib/utils';
import type { Complaint, Message, Evidence, ComplaintStatus } from '../../types';

const STATUSES: ComplaintStatus[] = ['Submitted', 'Under Review', 'Inquiry', 'Resolved', 'Closed'];

export default function IccComplaintDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [evidence, setEvidence] = useState<Evidence[]>([]);
    const [newMsg, setNewMsg] = useState('');
    const [internalNotes, setInternalNotes] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('Submitted');
    const [sending, setSending] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'evidence' | 'notes'>('chat');
    const [toast, setToast] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    useEffect(() => {
        if (!id) return;
        api.get<Complaint>(`/complaints/${id}`).then((r) => {
            setComplaint(r.data);
            setSelectedStatus(r.data.status);
            setInternalNotes(r.data.internalNotes ?? '');
        });
        api.get<Evidence[]>(`/evidence/${id}`).then((r) => setEvidence(r.data));
        const fetchMessages = () => api.get<Message[]>(`/complaints/${id}/messages`).then((r) => setMessages(r.data));
        fetchMessages();
        const interval = setInterval(fetchMessages, 8000);
        return () => clearInterval(interval);
    }, [id]);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMsg.trim()) return;
        setSending(true);
        try {
            const res = await api.post<Message>(`/complaints/${id}/messages`, { message: newMsg.trim(), senderRole: 'icc' });
            setMessages((prev) => [...prev, res.data]);
            setNewMsg('');
        } catch { /* ignore */ }
        finally { setSending(false); }
    };

    const handleUpdateStatus = async () => {
        if (!complaint) return;
        setUpdating(true);
        try {
            const res = await api.patch<Complaint>(`/complaints/${id}/status`, { status: selectedStatus, internalNotes });
            setComplaint(res.data);
            showToast(`Status updated to ${selectedStatus}`);
        } catch { showToast('Update failed'); }
        finally { setUpdating(false); }
    };

    if (!complaint) return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-main pb-12">
            {/* Toast */}
            {toast && (
                <div className="fixed top-4 right-4 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 border border-gray-800">{toast}</div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link to="/icc/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </Link>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    <div className="flex items-center gap-3 flex-1">
                        <span className="font-mono font-bold text-gray-900 text-lg">{complaint.caseId}</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusColor(complaint.status)}`}>{complaint.status}</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getSeverityColor(complaint.severityLevel)}`}>{complaint.severityLevel}</span>
                        {complaint.isAnonymous && <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">Anonymous</span>}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Info + Status */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-green-600" /> Complaint Details
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Incident Type', value: complaint.incidentType },
                                { label: 'Date', value: complaint.incidentDate },
                                { label: 'Location', value: complaint.location },
                                { label: 'Accused Role', value: complaint.accusedRole },
                                { label: 'Filed', value: formatDateTime(complaint.createdAt) },
                                { label: 'Updated', value: formatRelative(complaint.updatedAt) },
                            ].map(({ label, value }) => (
                                <div key={label} className="border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                                    <p className="text-sm font-semibold text-gray-900">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Description</h3>
                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{complaint.description}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Update Status</h3>
                        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium">
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={handleUpdateStatus} disabled={updating || selectedStatus === complaint.status}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-100">
                            {updating ? 'Updating...' : 'Update Status'}
                        </button>
                    </div>
                </div>

                {/* Right: Tabs */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-200 flex flex-col shadow-sm overflow-hidden" style={{ minHeight: '650px' }}>
                        {/* Tab bar */}
                        <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-1">
                            {[
                                { id: 'chat', label: 'Communication', icon: MessageSquare },
                                { id: 'evidence', label: `Evidence (${evidence.length})`, icon: FileText },
                                { id: 'notes', label: 'Internal Notes', icon: StickyNote },
                            ].map(({ id, label, icon: Icon }) => (
                                <button key={id} onClick={() => setActiveTab(id as typeof activeTab)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === id ? 'bg-white text-green-700 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
                                    <Icon className="w-4 h-4" />{label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 flex flex-col p-6 bg-[#F9FAFB]">
                            {/* Chat */}
                            {activeTab === 'chat' && (
                                <div className="flex flex-col h-full">
                                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" style={{ maxHeight: '450px' }}>
                                        {messages.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                                <MessageSquare className="w-10 h-10 mb-2 opacity-20" />
                                                <p className="text-sm font-medium">No messages yet.</p>
                                            </div>
                                        ) : messages.map((msg) => (
                                            <div key={msg._id} className={`flex ${msg.senderRole === 'icc' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-sm px-5 py-3 rounded-2xl text-sm shadow-sm ${msg.senderRole === 'icc' ? 'bg-green-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'}`}>
                                                    <p className={`text-xs font-bold mb-1 ${msg.senderRole === 'icc' ? 'text-green-100' : 'text-blue-600'}`}>{msg.senderRole === 'icc' ? 'ICC Committee' : 'Reporter (Anonymous)'}</p>
                                                    <p className="leading-relaxed">{msg.message}</p>
                                                    <p className={`text-[10px] mt-2 text-right ${msg.senderRole === 'icc' ? 'text-green-100/70' : 'text-gray-400'}`}>{formatRelative(msg.createdAt)}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    <form onSubmit={handleSendMessage} className="flex gap-3 pt-4 border-t border-gray-200">
                                        <textarea value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
                                            placeholder="Type a secure message to the reporter..."
                                            disabled={complaint.status === 'Closed'}
                                            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-all shadow-sm"
                                            rows={2} />
                                        <button type="submit" disabled={!newMsg.trim() || sending || complaint.status === 'Closed'}
                                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 rounded-xl transition-all self-end h-[58px] shadow-lg shadow-green-100">
                                            {sending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Evidence */}
                            {activeTab === 'evidence' && (
                                <div className="space-y-3">
                                    {evidence.length === 0 ? (
                                        <div className="text-center py-16 text-gray-400">
                                            <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                            <p className="text-sm font-medium">No evidence files uploaded.</p>
                                        </div>
                                    ) : evidence.map((ev) => (
                                        <div key={ev._id} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                                            {ev.fileType.startsWith('image/') ? (
                                                <img src={`http://localhost:5000${ev.fileUrl}`} alt={ev.fileName} className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                                                    <FileText className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{ev.fileName}</p>
                                                    {ev.aiRatedAt && (
                                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ev.aiIsReal ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                                            {ev.aiIsReal ? 'AI: Real' : 'AI: Flagged'}{ev.aiScore !== undefined ? ` · ${Math.round((ev.aiScore <= 1 ? ev.aiScore * 100 : ev.aiScore))}%` : ''}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{formatFileSize(ev.fileSize)} · {formatDateTime(ev.uploadedAt)}</p>
                                            </div>
                                            <a href={`http://localhost:5000${ev.fileUrl}`} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                                                <Download className="w-3.5 h-3.5" /> Download
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Notes */}
                            {activeTab === 'notes' && (
                                <div className="space-y-4 h-full flex flex-col">
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-sm text-amber-800">
                                        <StickyNote className="w-5 h-5 flex-shrink-0 text-amber-600" />
                                        Internal notes are private and only visible to authorized ICC members.
                                    </div>
                                    <textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)}
                                        placeholder="Add internal investigation notes, interview summaries, or private comments..."
                                        className="flex-1 w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 leading-relaxed shadow-sm" />
                                    <button onClick={handleUpdateStatus} disabled={updating}
                                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-green-100 self-end">
                                        {updating ? 'Saving...' : 'Save Notes'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
