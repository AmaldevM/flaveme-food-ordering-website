import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, User, Bot, HelpCircle } from "lucide-react";
import { axiosInstance } from "../../config/axiosInstance";
import { Link } from "react-router-dom";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm the **Flave Me AI Assistant**.\n\nHow can I help satisfy your cravings today? You can ask me to track your order, find restaurants, or discover the best items on our menu!",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Suggestions for user
  const suggestions = [
    { label: "🛵 Track my order", text: "Track my order status" },
    { label: "🍕 Cheapest Pizza", text: "What is the cheapest pizza?" },
    { label: "🏠 Find Restaurants", text: "List some restaurants" },
    { label: "🍔 Recommendation", text: "Recommend some burgers" },
  ];

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    // Clear input if sending from text bar
    if (!messageText) {
      setInput("");
    }

    // Add user message
    const userMsg = {
      sender: "user",
      text: textToSend,
      time: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/user/chatbot", {
        message: textToSend,
      });

      const reply = response.data?.reply || "I'm sorry, I'm having trouble processing that right now.";
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: reply,
          time: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Oops! I ran into an error connecting to our server. Please check your connection and try again.",
          time: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to format regular text (handles bold **text** and newlines)
  const renderTextFormatting = (text, partIndex) => {
    let parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      const key = `${partIndex}-${index}`;
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={key} className="font-semibold text-yellow-300 dark:text-yellow-400">
            {part.slice(2, -2)}
          </strong>
        );
      }
      
      let subParts = part.split(/(_.*?_)/g);
      return subParts.map((subPart, subIndex) => {
        const subKey = `${key}-${subIndex}`;
        if (subPart.startsWith("_") && subPart.endsWith("_")) {
          return <em key={subKey} className="italic">{subPart.slice(1, -1)}</em>;
        }

        let lines = subPart.split("\n");
        return lines.map((line, lineIndex) => (
          <React.Fragment key={`${subKey}-${lineIndex}`}>
            {line}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        ));
      });
    });
  };

  // Helper to format replies (handles links first, then bold/italics/newlines)
  const renderFormattedText = (text) => {
    if (!text) return "";
    
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    let parts = text.split(/(\[.*?\]\(.*?\))/g);
    
    return parts.map((part, index) => {
      const match = linkRegex.exec(part);
      linkRegex.lastIndex = 0; // Reset regex state
      
      if (match) {
        const linkText = match[1];
        const linkUrl = match[2];
        
        if (linkUrl.startsWith("/")) {
          return (
            <Link
              key={index}
              to={linkUrl}
              onClick={() => setIsOpen(false)} // Close chatbot modal on redirect
              className="underline text-yellow-300 font-bold hover:text-yellow-400 transition-colors"
            >
              {linkText}
            </Link>
          );
        }
        
        return (
          <a
            key={index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-yellow-300 font-bold hover:text-yellow-400 transition-colors"
          >
            {linkText}
          </a>
        );
      }
      
      return renderTextFormatting(part, index);
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {/* Chat Widget Window */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-4 w-96 max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-8rem)] bg-white/90 dark:bg-gray-950/90 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-950 rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight flex items-center gap-1.5">
                    Flave Me Bot
                  </h3>
                  <span className="text-[10px] text-indigo-100 flex items-center gap-1">
                    <span className="w-1 h-1 bg-indigo-200 rounded-full animate-ping"></span>
                    AI Assistant Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50/50 dark:bg-slate-900/10">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                      msg.sender === "user"
                        ? "bg-indigo-100 border-indigo-200 text-indigo-700"
                        : "bg-violet-100 border-violet-200 text-violet-700"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="max-w-[75%] flex flex-col">
                    <div
                      className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-tr-none"
                          : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
                      }`}
                    >
                      {renderFormattedText(msg.text)}
                    </div>
                    <span
                      className={`text-[9px] text-gray-400 mt-1 px-1 ${
                        msg.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Bot typing loader */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-violet-100 border border-violet-200 text-violet-700 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions list */}
            <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 flex gap-2 overflow-x-auto no-scrollbar">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug.text)}
                  disabled={isLoading}
                  className="px-3 py-1.5 shrink-0 bg-gray-100 dark:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 border border-gray-200/50 dark:border-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-300 font-medium active:scale-95 transition-all"
                >
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Flave Me bot..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-950 transition-all dark:text-white"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="w-14 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/35 relative overflow-hidden border border-white/10"
      >
        <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></span>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
