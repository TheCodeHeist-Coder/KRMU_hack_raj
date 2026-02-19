import Navbar from "@/components/Navbar";
import { useState } from "react";
import { FaChevronDown, FaGavel } from "react-icons/fa";

/* ───────────────────────────────────────────── */
/* FULL POSH / ICC RULES DATA (YOUR PROVIDED ONE) */
/* ───────────────────────────────────────────── */

const chapters = [
  {
    id: "constitution",
    title: "Constitution of ICC",
    icon: "🏛",
    rules: [
      {
        ruleNo: "Rule 1",
        heading: "Formation & Mandate",
        summary:
          "Every organization with 10 or more employees must constitute an Internal Complaints Committee under the POSH Act, 2013.",
        details: [
          "The ICC shall be constituted by the employer by written order.",
          "A new ICC must be reconstituted every 3 years.",
          "ICC contact details must be prominently displayed at the workplace.",
          "Failure to constitute an ICC is punishable with a fine up to ₹50,000.",
        ],
      },
      {
        ruleNo: "Rule 2",
        heading: "Composition of the Committee",
        summary:
          "The ICC must have at least 4 members, women in majority, and one external independent member.",
        details: [
          "A Presiding Officer — a senior woman employee.",
          "Minimum 2 employees committed to women's causes.",
          "1 external member from NGO or legal background.",
          "At least half of the members must be women.",
          "No member shall serve more than 3 consecutive terms.",
        ],
      },
      {
        ruleNo: "Rule 3",
        heading: "Disqualification of Members",
        summary:
          "An ICC member shall be removed if misconduct or conflict of interest is found.",
        details: [
          "Member convicted of an offence or disciplinary case pending.",
          "Member found guilty of misconduct or moral turpitude.",
          "Member abuses position against complainant/respondent.",
          "Vacancy must be filled within 60 days.",
        ],
      },
    ],
  },

  {
    id: "complaint",
    title: "Filing a Complaint",
    icon: "📋",
    rules: [
      {
        ruleNo: "Rule 4",
        heading: "Who Can File a Complaint",
        summary:
          "Any aggrieved woman can file a complaint including contractual, temporary or visiting employees.",
        details: [
          "The aggrieved woman may herself file the complaint.",
          "If physically unable, a legal heir, relative or co-worker may file.",
          "If mentally incapacitated, guardian or psychiatrist may file.",
          "In case of death, legal heir can file with evidence.",
          "Anonymous complaints can be filed through SafeDesk securely.",
        ],
      },
      {
        ruleNo: "Rule 5",
        heading: "Timeline for Filing",
        summary:
          "A complaint must be filed within 3 months of the incident or last incident.",
        details: [
          "Complaint must be submitted within 3 months.",
          "For recurring incidents, window starts from last incident.",
          "ICC may extend limit by 3 more months for valid reasons.",
          "Time limit pauses during temporary incapacity.",
        ],
      },
      {
        ruleNo: "Rule 6",
        heading: "Form & Contents of Complaint",
        summary:
          "Complaint must be written and contain details to enable ICC inquiry.",
        details: [
          "Name/address of complainant (can be withheld anonymously).",
          "Name/designation of respondent.",
          "Date, time, location of incident(s).",
          "Detailed description of harassment acts.",
          "Names of witnesses if applicable.",
          "Supporting evidence (emails, recordings, photos).",
          "Six copies required if filing physically.",
        ],
      },
      {
        ruleNo: "Rule 7",
        heading: "Conciliation (Settlement)",
        summary:
          "ICC may settle through conciliation only at request of complainant.",
        details: [
          "Conciliation cannot be initiated by ICC/respondent.",
          "No monetary settlement allowed.",
          "Settlement recorded and forwarded to employer.",
          "Copy provided to both parties.",
          "If respondent fails to comply, inquiry proceeds.",
        ],
      },
    ],
  },

  {
    id: "inquiry",
    title: "Inquiry Procedure",
    icon: "🔍",
    rules: [
      {
        ruleNo: "Rule 8",
        heading: "Commencement of Inquiry",
        summary:
          "ICC must proceed with fair, impartial and time-bound inquiry.",
        details: [
          "Inquiry must start within 7 days of complaint.",
          "Copy sent to respondent within 7 working days.",
          "Reply must be filed within 10 working days.",
          "Both parties given witness list.",
          "Inquiry completed within 90 days.",
        ],
      },
      {
        ruleNo: "Rule 9",
        heading: "Principles of Natural Justice",
        summary:
          "Both complainant and respondent have equal rights in inquiry.",
        details: [
          "Both can present case and cross-examine witnesses.",
          "No advocates allowed during proceedings.",
          "3 consecutive absences may lead to ex-parte inquiry.",
          "Identity must remain confidential.",
          "All proceedings strictly private.",
        ],
      },
      {
        ruleNo: "Rule 10",
        heading: "Interim Relief",
        summary:
          "ICC may recommend interim measures to protect complainant.",
        details: [
          "Transfer complainant or respondent.",
          "Grant leave up to 3 months.",
          "Restraining respondent from evaluating complainant.",
          "Any other protection deemed necessary.",
        ],
      },
      {
        ruleNo: "Rule 11",
        heading: "Confidentiality Obligations",
        summary:
          "All parties and members are bound by strict confidentiality.",
        details: [
          "Identity of parties/witnesses shall not be disclosed.",
          "Complaint and ICC report remain confidential.",
          "Breach punishable with fine up to ₹5,000.",
          "Details disclosed only for legal action purposes.",
          "SafeDesk ensures full technical anonymity.",
        ],
      },
    ],
  },

  {
    id: "findings",
    title: "Findings & Actions",
    icon: "⚖️",
    rules: [
      {
        ruleNo: "Rule 12",
        heading: "ICC Inquiry Report",
        summary:
          "ICC submits report within 10 days after inquiry completion.",
        details: [
          "Report submitted within 10 days.",
          "Copy given to complainant and respondent.",
          "If proved, action recommended under service rules.",
          "If not proved, no action recommended.",
          "Employer must act within 60 days.",
        ],
      },
      {
        ruleNo: "Rule 13",
        heading: "Recommended Punishments",
        summary:
          "If guilty, ICC may recommend penalties proportional to severity.",
        details: [
          "Written warning or censure.",
          "Withholding promotion or increments.",
          "Termination from service.",
          "Counseling/community service.",
          "Salary deduction as compensation.",
          "Employer may impose higher punishment if required.",
        ],
      },
      {
        ruleNo: "Rule 14",
        heading: "Compensation to the Complainant",
        summary:
          "ICC determines compensation based on trauma, loss, expenses.",
        details: [
          "Mental trauma and emotional distress.",
          "Loss of career opportunity.",
          "Medical/psychiatric expenses.",
          "Income status of respondent.",
          "Payment feasibility in installments/lump sum.",
          "Recovered from salary if employer cannot pay.",
        ],
      },
      {
        ruleNo: "Rule 15",
        heading: "Action on False / Malicious Complaints",
        summary:
          "If complaint is malicious, ICC may recommend action against complainant.",
        details: [
          "Only deliberate false complaints lead to action.",
          "Mere inability to prove does not make it malicious.",
          "Complainant must not be victimized unfairly.",
          "Action limited to service rules only.",
        ],
      },
    ],
  },

  {
    id: "appeal",
    title: "Appeals & Annual Report",
    icon: "📊",
    rules: [
      {
        ruleNo: "Rule 16",
        heading: "Right to Appeal",
        summary:
          "Both parties may appeal ICC recommendations within 90 days.",
        details: [
          "Appeal filed within 90 days.",
          "Govt employees appeal via service rules authority.",
          "Private employees appeal via tribunal/court.",
          "SafeDesk maintains audit logs for appeal support.",
        ],
      },
      {
        ruleNo: "Rule 17",
        heading: "Annual Report",
        summary:
          "ICC must prepare annual report summarizing all complaints.",
        details: [
          "Number of complaints received.",
          "Number disposed of.",
          "Number pending.",
          "Nature of employer action.",
          "Submitted to employer and District Officer.",
          "SafeDesk auto-generates POSH compliant reports.",
        ],
      },
      {
        ruleNo: "Rule 18",
        heading: "Employer's Duties & Obligations",
        summary:
          "Employer must ensure safe workplace and POSH compliance.",
        details: [
          "Provide harassment-free environment.",
          "Display penal consequences clearly.",
          "Organize awareness workshops.",
          "Assist ICC during inquiry.",
          "Treat harassment as misconduct under service rules.",
          "Monitor timely ICC report submission.",
          "Non-compliance may cancel business licenses.",
        ],
      },
    ],
  },
];


export default function ICCRulesPage() {
  const [activeChapter, setActiveChapter] = useState("constitution");
  const [openRule, setOpenRule] = useState(null);

  return (
    <div>
   <div className="sticky top-0">

     <Navbar />
   </div>

    <div className="min-h-screen bg-gray-100 text-gray-950 px-6 py-16 font-name">

      {/* HERO */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-name md:text-6xl font-bold tracking-wide">
          ICC Rules &{" "}
          <span className="text-green-700 drop-shadow-[0_0_2px_#00ff99]">
            POSH Compliance
          </span>
        </h1>

        <p className="mt-5 text-gray-600 max-w-2xl mx-auto tracking-wider">
          SafeDesk ensures every complaint, inquiry, and resolution follows the
          POSH Act (2013) with full anonymity and protection.
        </p>
      </div>


    <div className="max-w-6xl m-auto flex justify-between items-center py-12">

      <div className="">
        <h1 className=" font-number text-6xl font-bold tracking-wider  bg-clip-text text-transparent bg-linear-to-b from-green-600 to-green-800"> 5 </h1>
        <p className="font-main font-semibold tracking-wider"> Chapters </p>
      </div>

      <div>
        <h1  className=" font-number text-6xl font-bold tracking-wider  bg-clip-text text-transparent bg-linear-to-b from-green-600 to-green-800"> 18 </h1>
        <p className="font-main font-semibold tracking-wider"> Rules </p>
      </div>
      <div> 
        <h1  className=" font-number text-6xl font-bold tracking-wider  bg-clip-text text-transparent bg-linear-to-b from-green-600 to-green-800"> 2013 </h1>
        <p className="font-main font-semibold tracking-wider"> POSH Act Year </p>
         </div>
      <div>
        <h1  className=" font-number text-6xl font-bold tracking-wider  bg-clip-text text-transparent bg-linear-to-b from-green-600 to-green-800">90</h1>
        <p className="font-main font-semibold tracking-wider"> Day Inquery List </p>
      </div>

    </div>






      {/* LAYOUT */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* SIDEBAR */}
        <aside className="md:col-span-1 space-y-3">
          <h2 className="text-sm uppercase text-gray-600 tracking-widest">
            Chapters
          </h2>

          {chapters.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveChapter(c.id);
                setOpenRule(null);
              }}
              className={`w-full px-4 py-3 rounded-xl text-left font-medium transition ${
                activeChapter === c.id
                  ? "bg-green-500 text-black shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-gray-700"
              }`}
            >
              {c.icon} {c.title}
            </button>
          ))}
        </aside>

        {/* MAIN */}
        <main className="md:col-span-3 space-y-6">

          {/* ACTIVE CHAPTER */}
          {chapters
            .filter((c) => c.id === activeChapter)
            .map((chapter) => (
              <div key={chapter.id}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  {chapter.icon} {chapter.title}
                </h2>

                {/* RULES */}
                <div className="space-y-4">
                  {chapter.rules.map((rule, i) => {
                    const isOpen = openRule === i;

                    return (
                      <div
                        key={i}
                        className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
                      >
                        {/* HEADER */}
                        <button
                          onClick={() =>
                            setOpenRule(isOpen ? null : i)
                          }
                          className="w-full flex justify-between items-center px-6 py-5 text-left"
                        >
                          <div>
                            <p className="text-green-400 text-md font-normal uppercase tracking-widest">
                              {rule.ruleNo}
                            </p>
                            <h3 className="font-semibold text-lg">
                              {rule.heading}
                            </h3>
                            {!isOpen && (
                              <p className="text-gray-700 text-sm mt-1">
                                {rule.summary}
                              </p>
                            )}
                          </div>

                          <FaChevronDown
                            className={`transition ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* BODY */}
                        {isOpen && (
                          <div className="px-8 pb-6 text-gray-700 space-y-3">
                            <p className="text-sm">{rule.summary}</p>

                            <ul className="list-disc pl-5 space-y-2 text-sm">
                              {rule.details.map((d, idx) => (
                                <li key={idx}>{d}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* FOOTER */}
          <div className="mt-14 p-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-transparent border border-green-500/20 flex gap-4">
            <FaGavel className="text-green-400 text-3xl" />
            <div>
              <h3 className="font-bold text-lg">
                SafeDesk is Fully POSH Compliant
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Every complaint, inquiry, and action follows these rules with
                encrypted evidence storage, role-based access, and anonymity.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
    </div>
  );
}
