import { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full relative  text-gray-900 bg-white/40 backdrop-blur-2xl font-main pt-4">

   <div className="absolute bottom-0 inset-x-0 bg-linear-to-r from-transparent via-green-400 to-transparent h-px ">

   </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navbar Main Row */}
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
           <img className="w-8 h-8" src="/logo .png" alt="" />
            <h1 className="text-xl font-bold tracking-wide">
              SafeDesk
            </h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 font-light">
            <a href="#report" className="hover:text-green-400 transition">
              Report
            </a>
            <a href="#evidence" className="hover:text-green-400 transition">
              Evidence Vault
            </a>
            <a href="#chat" className="hover:text-green-400 transition">
              Anonymous Chat
            </a>
            <a href="#dashboard" className="hover:text-green-400 transition">
              Dashboard
            </a>
          </div>

          {/* Quick Hide Button (Desktop) */}
          <div className="hidden md:block">
           <Link className=" bg-green-500 text-white  tracking-wider  hover:bg-green-600 rounded-full px-10 py-3 shadow font-semibold transition" to="/icc/login"> ICC Login </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-3xl text-white"
            >
              {isOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden bg-indigo-900 rounded-xl p-4 space-y-4">
            <a
              href="#report"
              className="block hover:text-green-400 transition"
            >
              Report
            </a>
            <a
              href="#evidence"
              className="block hover:text-green-400 transition"
            >
              Evidence Vault
            </a>
            <a
              href="#chat"
              className="block hover:text-green-400 transition"
            >
              Anonymous Chat
            </a>
            <a
              href="#dashboard"
              className="block hover:text-green-400 transition"
            >
              Dashboard
            </a>

            {/* Quick Hide Button (Mobile) */}
            <button className="w-full bg-white text-blue-900 py-2 rounded-xl font-semibold shadow hover:bg-purple-200 transition">
              Quick Hide
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}