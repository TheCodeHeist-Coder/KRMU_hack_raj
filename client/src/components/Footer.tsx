import React from 'react';
import { FaShieldAlt, FaTwitter, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="relative bg-black text-white pt-20 pb-10 overflow-hidden font-main mt-20">

            {/* Top Gradient Border matching Navbar */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-transparent via-green-500 to-transparent h-px opacity-50"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <FaShieldAlt className="text-green-400 text-3xl" />
                            <h2 className="text-2xl font-bold tracking-wide font-special">SafeDesk</h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Empowering safe workplaces through secure, anonymous reporting.
                            Compliance with POSH Act 2013 guaranteed.
                        </p>
                        <div className="flex gap-4">
                            {[FaTwitter, FaLinkedin, FaInstagram, FaGithub].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-green-400 hover:border-green-500/50 transition-all duration-300 bg-gray-900/50"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-green-400 font-main tracking-wide">Platform</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/report" className="hover:text-white transition-colors">File Complaint</Link></li>
                            <li><Link to="/track" className="hover:text-white transition-colors">Track Status</Link></li>
                            <li><Link to="/icc/login" className="hover:text-white transition-colors">ICC Login</Link></li>
                            <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                        </ul>
                    </div>

                    {/* Legal/Compliance */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-green-400 font-main tracking-wide">Compliance</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">POSH Act Guidelines</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-green-400 font-main tracking-wide">Contact</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 font-bold">E:</span>
                                <span>support@safedesk.inc</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 font-bold">P:</span>
                                <span>+91 1800-SAFE-WORK</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 font-bold">A:</span>
                                <span>Tech Park, Sector 45<br />Gurugram, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} SafeDesk. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            System Operational
                        </span>
                        <span>v1.0.0 (Stable)</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
