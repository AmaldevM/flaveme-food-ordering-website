import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Utensils, HelpCircle } from "lucide-react";

export default function LoadingScreen() {
  const [messageIdx, setMessageIdx] = useState(0);
  const loadingMessages = [
    "Calibrating autonomous drone flight corridors...",
    "Heating up convection ovens...",
    "Sourcing organic, fresh farm ingredients...",
    "Preparing 3D culinary models...",
    "Syncing with local partner restaurants...",
    "Assembling your personalized meal dashboard...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIdx((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-slate-950 font-sans select-none overflow-hidden">
      {/* Decorative background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

      {/* Main Loader Core */}
      <div className="relative flex flex-col items-center">
        
        {/* Glowing Spinning Ring */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
            className="absolute inset-0 border-4 border-t-orange-500 border-r-indigo-500 border-b-purple-500 border-l-transparent rounded-full shadow-lg shadow-indigo-500/10"
          ></motion.div>
          
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="absolute w-16 h-16 border-2 border-b-emerald-400 border-l-yellow-400 border-t-transparent border-r-transparent rounded-full"
          ></motion.div>

          <Utensils className="w-8 h-8 text-white relative z-10 animate-bounce" />
        </div>

        {/* Brand details */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xl font-black text-white tracking-widest uppercase font-montserrat">
              Flave Me
            </span>
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Next-Gen AI Platform
          </p>
        </div>

        {/* Dynamic Telemetry Status log */}
        <div className="mt-12 w-80 text-center h-8 flex items-center justify-center">
          <motion.p
            key={messageIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-xs text-indigo-300 font-semibold leading-relaxed"
          >
            {loadingMessages[messageIdx]}
          </motion.p>
        </div>

        {/* Pulse progress bar indicator */}
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
          <motion.div 
            className="h-full bg-gradient-to-r from-orange-500 to-indigo-500"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
}
