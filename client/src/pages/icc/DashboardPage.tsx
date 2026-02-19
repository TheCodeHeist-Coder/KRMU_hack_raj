import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, LayoutDashboard, Users, BarChart3, Search, Filter } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { formatRelative, getStatusColor, getSeverityColor } from '../../lib/utils';
import type { Complaint, ComplaintStatus, SeverityLevel } from '../../types';

export default function IccDashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<ComplaintStatus | ''>('');
    const [severityFilter, setSeverityFilter] = useState<SeverityLevel | ''>('');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const params: Record<string, string> = {};
                if (statusFilter) params.status = statusFilter;
                if (severityFilter) params.severity = severityFilter;
                const res = await api.get<Complaint[]>('/complaints', { params });
                setComplaints(res.data);
            } catch { /* ignore */ }
            finally { setLoading(false); }
        };
        fetchComplaints();
    }, [statusFilter, severityFilter]);

    const filtered = complaints.filter((c) =>
        !search || c.caseId.toLowerCase().includes(search.toLowerCase()) ||
        c.incidentType.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
        total: complaints.length,
        pending: complaints.filter((c) => ['Submitted', 'Under Review', 'Inquiry'].includes(c.status)).length,
        resolved: complaints.filter((c) => ['Resolved', 'Closed'].includes(c.status)).length,
        high: complaints.filter((c) => c.severityLevel === 'High').length,
    };

    const handleLogout = () => { logout(); navigate('/icc/login'); };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex font-main">
            {/* Sidebar */}
            <aside className="w-64 bg-black text-white flex flex-col border-r border-gray-800">
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-900/50">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold font-special tracking-wider text-lg">SafeDesk</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">{user?.role} Portal</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link to="/icc/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-green-600/10 text-green-400 text-sm font-bold border border-green-600/20">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                        <>
                            <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
                                <BarChart3 className="w-4 h-4" /> Compliance
                            </Link>
                            <Link to="/admin/members" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
                                <Users className="w-4 h-4" /> ICC Members
                            </Link>
                        </>
                    )}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <div className="text-xs text-gray-500 mb-3 truncate">{user?.email}</div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 font-special tracking-wide">Complaints Dashboard</h1>
                        <div className="text-sm text-gray-500 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total Cases', value: stats.total, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
                            { label: 'Pending Action', value: stats.pending, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
                            { label: 'Resolved', value: stats.resolved, color: 'text-green-700', bg: 'bg-green-50 border-green-100' },
                            { label: 'High Severity', value: stats.high, color: 'text-red-700', bg: 'bg-red-50 border-red-100' },
                        ].map(({ label, value, color, bg }) => (
                            <div key={label} className={`${bg} border rounded-2xl p-6 shadow-sm`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
                                <p className={`text-4xl font-bold ${color} font-mono`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input value={search} onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by Case ID, type, location..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all placeholder-gray-400" />
                        </div>
                        <div className="flex gap-3">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | '')}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-700">
                                <option value="">All Status</option>
                                {['Submitted', 'Under Review', 'Inquiry', 'Resolved', 'Closed'].map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value as SeverityLevel | '')}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-700">
                                <option value="">All Severity</option>
                                {['High', 'Medium', 'Low'].map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20">
                                <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No complaints found matching your criteria.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            {['Case ID', 'Type', 'Location', 'Status', 'Severity', 'Filed'].map((h) => (
                                                <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filtered.map((c) => (
                                            <tr key={c._id} onClick={() => navigate(`/icc/complaints/${c._id}`)}
                                                className="hover:bg-green-50/50 cursor-pointer transition-colors group">
                                                <td className="px-6 py-4 font-mono text-sm font-bold text-gray-900 group-hover:text-green-700">{c.caseId}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{c.incidentType}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{c.location}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusColor(c.status)}`}>{c.status}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getSeverityColor(c.severityLevel)}`}>{c.severityLevel}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-400 font-mono">{formatRelative(c.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
