import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, UserPlus, Trash2, Shield, Mail, LayoutDashboard, BarChart3, LogOut, CheckCircle } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import type { User, UserRole } from '../../types';

export default function AdminMembersPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [members, setMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'icc' as UserRole, displayName: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { fetchMembers(); }, []);

    const fetchMembers = async () => {
        try {
            const res = await api.get<User[]>('/admin/members');
            setMembers(res.data);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const res = await api.post<User>('/admin/members', newUser);
            setMembers((prev) => [res.data, ...prev]);
            setShowAdd(false);
            setNewUser({ email: '', password: '', role: 'icc', displayName: '' });
        } catch (err: unknown) {
            setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to add member');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;
        try {
            await api.delete(`/admin/members/${id}`);
            setMembers((prev) => prev.filter((m) => m.id !== id));
        } catch { alert('Failed to remove member'); }
    };

    const handleLogout = () => { logout(); navigate('/icc/login'); };

    if (loading) return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full" />
        </div>
    );

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
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
                        <BarChart3 className="w-4 h-4" /> Compliance
                    </Link>
                    <Link to="/admin/members" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-green-600/10 text-green-400 text-sm font-bold border border-green-600/20">
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
                <div className="p-8 max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-special tracking-wide">ICC Members</h1>
                            <p className="text-gray-500 mt-1">Manage Internal Complaints Committee access</p>
                        </div>
                        <button onClick={() => setShowAdd(!showAdd)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all shadow-lg font-medium ${showAdd ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-green-600 text-white hover:bg-green-700 shadow-green-100'}`}>
                            {showAdd ? 'Cancel' : <><UserPlus className="w-4 h-4" /> Add Member</>}
                        </button>
                    </div>

                    {showAdd && (
                        <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-lg shadow-green-50 mb-8 animate-in fade-in slide-in-from-top-4">
                            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-green-600" />
                                Add New Member
                            </h3>
                            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                                    <input value={newUser.displayName} onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                                        required placeholder="e.g. Jane Doe"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        required placeholder="e.g. icc@company.com"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                    <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        required placeholder="••••••••" minLength={6}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                                    <div className="relative">
                                        <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none">
                                            <option value="icc">ICC Member</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                                {error && <p className="col-span-2 text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
                                <div className="col-span-2 flex justify-end gap-3 mt-2 border-t border-gray-100 pt-4">
                                    <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 text-gray-500 hover:text-gray-700 text-sm font-bold transition-colors">Cancel</button>
                                    <button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-100">
                                        {submitting ? 'Adding...' : 'Save Member'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid gap-4">
                        {members.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No members found.</p>
                            </div>
                        ) : members.map((member) => (
                            <div key={member.id} className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center justify-between group hover:border-green-300 hover:shadow-md transition-all">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm ${member.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                        {member.displayName?.charAt(0) ?? member.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">{member.displayName}</h4>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                            <div className="flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5" />
                                                {member.email}
                                            </div>
                                            <span className={`text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wide font-bold ${member.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                                {member.role === 'icc' ? 'ICC Member' : 'System Admin'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(member.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
