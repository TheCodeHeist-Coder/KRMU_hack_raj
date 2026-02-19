import { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

export default function SakhiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi I’m Sakhi. You are safe here. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    setInput("");

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([...newMessages, { sender: "bot", text: data.reply }]);
  };

  return (
    <>
      {/* Floating Bot Icon + Bubble */}
      {!open && (
        <div className="fixed bottom-15 right-28 flex flex-col items-center gap-2">
          
          {/* Text Bubble */}
          <div className=" text-gray-900 px-4 py-2 rounded-2xl tracking-wider  shadow-md text-sm font-medium animate-fadeIn">
            May I help you? 
          </div>

          {/* Floating Icon Button */}
          <button
            onClick={() => setOpen(true)}
            className="  p-4 cursor-pointer 
             transition animate-float"
          >
           <img className="w-40 h-40 drop-shadow-[0_0px_8px_rgba(0,255,0,0.8)]" src="/sakhi01.png" alt="" />
          </button>
        </div>
      )}

      {/* Chat Popup */}
      <div
        className={`fixed bottom-0 z-50 right-5 h-[70%] w-full sm:w-[500px] bg-gray-50  shadow-2xl border border-green-400 rounded-t-2xl 
        transform transition-all duration-500 ease-in-out
        ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-green-300 to-green-400 text-gray-950 font-semibold tracking-wider p-4 rounded-t-2xl">
          <h2 className="font-semibold text-lg font-main tracking-wider">Sakhi Support Agent </h2>

          <button
            onClick={() => setOpen(false)}
            className="text-2xl hover:text-purple-200"
          >
            <IoMdClose />
          </button>
        </div>

        {/* Messages */}
        <div className="p-4 h-[75%] overflow-y-auto space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.sender === "user"
                  ? "ml-auto bg-green-400 text-gray-900"
                  : "mr-auto bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 flex gap-2 border-t">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type here..."
            className="flex-1 border rounded-xl px-3 py-2 focus:outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-green-700 text-white px-8 rounded-full cursor-pointer hover:bg-green-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
