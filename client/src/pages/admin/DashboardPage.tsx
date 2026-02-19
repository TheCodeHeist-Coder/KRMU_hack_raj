import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Users, FileText, Download, BarChart3, PieChart, LayoutDashboard, LogOut } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import type { ComplianceStats, ComplaintStatus, SeverityLevel } from '../../types';

export default function AdminDashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<ComplianceStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<ComplianceStats>('/admin/stats')
            .then((res) => setStats(res.data))
            .catch(() => { /* ignore */ })
            .finally(() => setLoading(false));
    }, []);

    const downloadReport = async () => {
        try {
            const element = document.getElementById('compliance-report');
            if (!element) return;

            // Higher scale + CORS help produce a sharper image and avoid tainting issues
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Calculate the image height in PDF units
            // @ts-ignore - jsPDF types may not include getImageProperties on this instance
            const imgProps = (pdf as any).getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`POSH-Compliance-Report-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err: any) {
            // Log and surface a friendly message so users know why export failed
            // eslint-disable-next-line no-console
            console.error('Export report failed:', err);
            // Fallback: notify user
            // In the browser this will alert; in-app you might show a toast instead
            // (kept simple here to avoid adding new UI dependencies)
            // @ts-ignore
            alert(`Export failed: ${err?.message ?? err}`);
        }
    };

    const handleLogout = () => { logout(); navigate('/icc/login'); };

    if (loading) return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full" />
        </div>
    );

    if (!stats) return <div className="p-8 text-center text-gray-500 font-main">Failed to load statistics.</div>;

    const statusColors: Record<ComplaintStatus, string> = {
        'Submitted': 'bg-blue-500', 'Under Review': 'bg-purple-500',
        'Inquiry': 'bg-amber-500', 'Resolved': 'bg-green-500', 'Closed': 'bg-gray-500'
    };

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
                    <Link to="/icc/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-green-600/10 text-green-400 text-sm font-bold border border-green-600/20">
                        <BarChart3 className="w-4 h-4" /> Compliance
                    </Link>
                    <Link to="/admin/members" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
                        <Users className="w-4 h-4" /> ICC Members
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <div className="text-xs text-gray-500 mb-3 truncate">{user?.email}</div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-special tracking-wide">Compliance Dashboard</h1>
                            <p className="text-gray-500 mt-1">POSH Act Implementation Overview</p>
                        </div>
                        <button onClick={downloadReport} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-100 font-medium">
                            <Download className="w-4 h-4" /> Export Report
                        </button>
                    </div>

                    <div id="compliance-report" className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
                        {/* Header for PDF */}
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Annual Compliance Report</h2>
                                <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Complaints', value: stats.totalComplaints, icon: FileText, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
                                { label: 'Resolved (This Month)', value: stats.resolvedThisMonth, icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-50 border-green-100' },
                                { label: 'Pending Action', value: stats.pendingComplaints, icon: BarChart3, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
                                { label: 'ICC Members', value: 'Active', icon: Users, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-100' },
                            ].map((item, i) => (
                                <div key={i} className={`${item.bg} border p-6 rounded-2xl`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{item.label}</span>
                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                    </div>
                                    <p className={`text-3xl font-bold ${item.color} font-mono`}>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Status Breakdown */}
                            <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50">
                                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <PieChart className="w-4 h-4 text-gray-400" /> Case Status Distribution
                                </h3>
                                <div className="space-y-4">
                                    {(Object.keys(stats.byStatus) as ComplaintStatus[]).map((status) => (
                                        <div key={status} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 font-medium">{status}</span>
                                                <span className="font-bold text-gray-900">{stats.byStatus[status]}</span>
                                            </div>
                                            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${statusColors[status]}`}
                                                    style={{ width: `${stats.totalComplaints ? (stats.byStatus[status] / stats.totalComplaints) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Severity Breakdown */}
                            <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50">
                                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-gray-400" /> Severity Analysis
                                </h3>
                                <div className="flex items-end gap-4 h-56 mt-4">
                                    {(['Low', 'Medium', 'High'] as SeverityLevel[]).map((level) => {
                                        const count = stats.bySeverity[level];
                                        const height = stats.totalComplaints ? (count / stats.totalComplaints) * 100 : 0;
                                        return (
                                            <div key={level} className="flex-1 flex flex-col justify-end items-center gap-2 h-full group">
                                                <span className="font-bold text-gray-900 mb-1">{count}</span>
                                                <div
                                                    className={`w-full rounded-t-xl transition-all relative overflow-hidden ${level === 'High' ? 'bg-red-500 group-hover:bg-red-600' : level === 'Medium' ? 'bg-amber-500 group-hover:bg-amber-600' : 'bg-green-500 group-hover:bg-green-600'
                                                        }`}
                                                    style={{ height: `${Math.max(height, 5)}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white/10"></div>
                                                </div>
                                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-2">{level}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Compliance Badge */}
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-5">
                            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-sm">
                                <Shield className="w-7 h-7 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-green-900 text-lg">POSH Act Compliance Status: Active</h4>
                                <p className="text-sm text-green-700 mt-1">Organization is fully compliant with Internal Complaints Committee constitution and annual reporting requirements.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
}
