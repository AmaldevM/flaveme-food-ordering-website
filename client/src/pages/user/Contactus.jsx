import React, { useState } from 'react';
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

const Contactus = () => {
  const [data, setData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Thank you! Your query has been logged successfully.");
      setData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] py-12 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 select-none">
      
      {/* Contact info details */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-8">
        <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none"></div>
        
        <div className="space-y-4">
          <p className="text-sm font-extrabold text-amber-500 tracking-wider uppercase">Contact Channels</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-montserrat">Get in Touch</h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Have questions about delivery docking coordinates, kitchen partner integrations, or payments? Shoot us a message!
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-gray-400 text-xs block uppercase font-bold tracking-wider">Email Address</span>
              <span className="text-white text-sm font-semibold">support@flaveme.com</span>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-gray-400 text-xs block uppercase font-bold tracking-wider">Helpline</span>
              <span className="text-white text-sm font-semibold">+91 98765 43210</span>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-gray-400 text-xs block uppercase font-bold tracking-wider">HQ Coordinates</span>
              <span className="text-white text-sm font-semibold">Port 4B, Indiranagar, Bangalore, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-8 sm:p-10 rounded-3xl space-y-5 relative">
        <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-orange-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-200 block">Name *</label>
          <input
            type="text"
            placeholder="John Doe"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-200 block">Email Address *</label>
          <input
            type="email"
            placeholder="john.doe@example.com"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-200 block">Subject</label>
          <input
            type="text"
            placeholder="Feedback/Support request"
            value={data.subject}
            onChange={(e) => setData({ ...data, subject: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-200 block">Message *</label>
          <textarea
            placeholder="Describe your query..."
            value={data.message}
            onChange={(e) => setData({ ...data, message: e.target.value })}
            required
            rows="4"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Contactus;
