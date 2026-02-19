import { FaLock, FaFileUpload, FaComments, FaBolt, FaClipboardList } from "react-icons/fa";

export default function Features() {
  const features = [
    {
      icon: <FaLock />,
      tag: "Core Feature",
      title: "Anonymous Reporting",
      desc: "Submit complaints without creating an account. No IP tracking, no identity exposure — complete privacy guaranteed.",
    },
    {
      icon: <FaFileUpload />,
      tag: "Evidence Vault",
      title: "Secure Evidence Locker",
      desc: "Upload images, audio, or PDFs safely. Metadata like GPS and device info is stripped automatically.",
    },
    {
      icon: <FaClipboardList />,
      tag: "Compliance",
      title: "POSH Compliance Logs",
      desc: "Every ICC action is logged with timestamps. Generate audit-ready POSH reports instantly.",
    },
    {
      icon: <FaBolt />,
      tag: "Safety",
      title: "Quick Hide Screen",
      desc: "Instantly mask SafeDesk with one click if someone approaches. Your safety stays in your control.",
    },
  ];

  return (
    <section
      id="features"
      className="w-full py-2 bg-gradient-to-b from-gray-50 to-white"
    >
      {/* Heading */}
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-5xl font-extrabold tracking-wider uppercase ">
          Features
        </p>

        <h2 className="text-gray-600 text-lg mt-4 font-main tracking-wide max-w-3xl mx-auto">
          Built for Safety. <br />
          Designed for Trust.
        </h2>

       
      </div>

      {/* Feature Grid */}
      <div className="max-w-6xl mx-auto px-6 mt-16 grid gap-8 md:grid-cols-2 font-main">
        {/* Normal Cards */}
        {features.map((f, i) => (
          <div
            key={i}
            className="group bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300"
          >
            {/* Icon + Tag */}
            <div className="flex items-center gap-3">
              <div className="text-green-500 text-2xl">
                {f.icon}
              </div>

              <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-green-400 text-gray-950 font-medium">
                {f.tag}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-b from-green-600 to-green-800 mt-5 group-hover:text-green-700 transition">
              {f.title}
            </h3>

            {/* Desc */}
            <p className="text-gray-700 mt-3 leading-relaxed tracking-wider text-sm">
              {f.desc}
            </p>
          </div>
        ))}

        {/* Highlighted Chat Feature */}
        <div className="md:col-span-2 bg-linear-to-r from-green-900 to-green-700 text-white rounded-3xl p-10 shadow-xl flex flex-col md:flex-row gap-10 items-center">
          
          {/* Left */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <FaComments className="text-3xl text-green-500" />

              <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-white/30 text-white font-medium">
                Communication
              </span>
            </div>

            <h3 className="text-2xl font-bold mt-5">
              Two-Way Anonymous Chat
            </h3>

            <p className="text-white/80 mt-4 leading-relaxed">
              Communicate directly with ICC members using only your Case ID.
              No identity is revealed, ensuring complete confidentiality during
              investigations.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mt-6">
              {["Encrypted Messages", "Case ID Only", "Real-Time Updates"].map(
                (t) => (
                  <span
                    key={t}
                    className="text-xs px-4 py-2 rounded-full bg-white/10 border border-white/20"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Right Terminal Box */}
          <div className="flex-1 bg-black/30 rounded-2xl p-6 font-mono text-sm w-full">
            <p className="text-green-300">// Anonymous communication log</p>

            <p className="mt-3">
              <span className="text-purple-200">case_id</span> →{" "}
              <span className="text-green-200">"CASE-7X9K2M"</span>
            </p>

            <p>
              <span className="text-purple-200">identity</span> →{" "}
              <span className="text-red-200">null</span>
            </p>

            <p>
              <span className="text-purple-200">metadata</span> →{" "}
              <span className="text-red-200">removed</span>
            </p>

            <p>
              <span className="text-purple-200">encrypted</span> →{" "}
              <span className="text-green-200">true</span>
            </p>

            <p className="text-green-300 mt-4">
              // Your voice. Anonymous. Protected.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
