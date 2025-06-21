import React, { useState, useRef, useEffect } from "react";

const ChatTooltipButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, newMsg]);

    // Simulated reply
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: "Thanks for your message!" }]);
    }, 500);

    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Chat Box */}
      {isOpen && (
        <div className="w-80 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-sky-500 text-white px-4 py-2 flex justify-between items-center">
            <span className="font-medium text-sm">Chat with us</span>
            <button onClick={toggleChat} className="text-white text-xl leading-none">
              ×
            </button>
          </div>
          <div className="p-3 flex-1 h-64 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm p-2 rounded max-w-[75%] ${
                  msg.sender === "user" ? "bg-blue-100 self-end ml-auto" : "bg-gray-100 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-sky-500 text-white px-3 py-1 rounded text-sm hover:bg-sky-600"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {/* {!isOpen && (
        <div className="relative bg-white shadow-lg rounded-md px-4 py-2 text-sm text-black">
          Click to send us a message.
          <div className="absolute top-1/2 right-[-8px] transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white"></div>
        </div>
      )} */}

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="relative w-20 h-20 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 flex items-center justify-center shadow-xl transition-transform hover:scale-105 animate-bounce-slow"
      >
        {/* Chatbot Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.477 2 2 5.91 2 10.5 2 13.253 3.775 15.683 6.5 17v3c0 .55.672.828 1.06.44l2.06-2.06a11.84 11.84 0 002.38.25c5.523 0 10-3.91 10-8.5S17.523 2 12 2zM7 10.5c-.828 0-1.5-.672-1.5-1.5S6.172 7.5 7 7.5 8.5 8.172 8.5 9 7.828 10.5 7 10.5zm10 0c-.828 0-1.5-.672-1.5-1.5S16.172 7.5 17 7.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5z" />
        </svg>

        {/* AI Badge */}
        {/* <span className="absolute -top-1 -right-1 text-[10px] bg-white text-blue-600 font-bold rounded-full px-1.5 py-0.5 border border-blue-600 shadow">
          AI
        </span> */}
      </button>
    </div>
  );
};

export default ChatTooltipButton;
