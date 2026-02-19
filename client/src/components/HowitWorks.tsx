import React from "react";
import { motion } from "framer-motion";
import { FaBook } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi";
import { FaAcquisitionsIncorporated } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs"

const steps = [
    {
        title: "File Your Report",
        desc: "Submit your complaint anonymously. No account needed, no login required. All metadata is stripped from uploaded evidence before storage.",
        number: <FaBook className="w-10 h-10" />,
        color: "from-pink-500 to-purple-500",
    },
    {
        title: " Receive a Case ID",
        desc: "You get a unique Case ID — your only link to your complaint. No personal data is stored. Use this ID to track progress and communicate anonymously.",
        number: <HiLockClosed className="w-10 h-10" />,
        color: "from-indigo-500 to-blue-500",
    },
    {
        title: "ICC Takes Action",
        desc: "Your Internal Complaints Committee receives the case, investigates per POSH guidelines, and communicates with you — all without ever knowing your identity.",
        number: <FaAcquisitionsIncorporated className="w-10 h-10" />,
        color: "from-emerald-500 to-teal-500",
    },
];

export default function HowitWorks() {
    return (
        <section className="w-full py-24 bg-linear-to-b from-gray-50 to-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-5xl font-extrabold tracking-tight"
                >
                    How It Works
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-5 text-gray-600 text-lg font-main tracking-wide max-w-2xl mx-auto"
                >
                    A powerful 3-step journey designed to create safer workplaces through
                    reporting, support, and action.
                </motion.p>

                {/* Steps */}
                <div className="flex justify-center items-center">


                    <div className="mt-20  relative flex flex-col md:flex-row items-center justify-between gap-15">
                        {/* Connector Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-[3px] bg-gradient-to-r from-green-300 via-green-500 to-green-600" />

                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                whileHover={{ scale: 1.02 }}
                                className="relative z-10 group"
                            >
                                {/* Custom Card */}
                                <div className="w-92 rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl p-10 text-left border border-green-1200">
                                    {/* Number Badge */}
                                    <div
                                        className={`w-14 h-14 flex items-center justify-center rounded-2xl text-green-900 font-bold text-xl shadow-lg`}
                                    >
                                        {step.number}
                                    </div>

                                    <h3 className="mt-6 text-2xl font-bold tracking-wider font-main  bg-clip-text text-transparent bg-linear-to-b from-green-600 to-green-800 transition">
                                        {step.title}
                                    </h3>

                                    <p className="mt-4 text-gray-600 leading-relaxed tracking-wide">
                                        {step.desc}
                                    </p>

                                    {/* Decorative Glow */}
                                    <div
                                        className={`absolute -z-10 inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition duration-500 `}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>


          <div className="relative flex items-center justify-center px-8 py-12 overflow-hidden">

 

  {/* Card */}
  <div className="relative border max-w-7xl  bg-black border-green-500 rounded-2xl py-8 px-7 flex items-center gap-7  z-10">
     {/* Animated Dots Background */}
  <div className="absolute inset-0 dots-bg"></div>

    <div>
      <BsFillShieldLockFill className="w-22 h-22 text-green-500" />
    </div>

    <div className="flex flex-col gap-3">
      <h3 className="text-2xl tracking-wider text-white font-semibold font-starter">
        Zero knowledge Architecture
      </h3>

      <p className="text-md tracking-wide text-gray-50">
        SafeDesk is architecturally designed so that even system administrators cannot link a complaint to a specific employee. Your identity is not just hidden — it is technically impossible to recover. End-to-end encryption, metadata stripping, and role-based access controls ensure absolute confidentiality.
      </p>
    </div>
  </div>
</div>

        </section>
    );
}