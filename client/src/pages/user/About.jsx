import React from 'react';
import { ShieldCheck, HeartHandshake, Eye, Sparkles } from "lucide-react";

export const About = () => {
  return (
    <div className="min-h-[80vh] py-12 px-6 max-w-5xl mx-auto space-y-12 select-none">
      {/* Header card */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl relative overflow-hidden space-y-4 text-center">
        <div className="absolute top-[-30%] left-[-10%] w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]"></div>
        <p className="text-sm font-extrabold text-amber-500 tracking-wider uppercase">Our Identity</p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-montserrat">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Flave Me</span>
        </h1>
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Flave Me is a futuristic culinary aggregator bridging the gap between gourmet dining and state-of-the-art delivery convenience.
        </p>
      </div>

      {/* Core Values grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-6 rounded-2xl space-y-4 glass-card-hover">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/35">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Our Vision</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            To digitalize food orders using procedural 3D showcases and autonomous flight navigation systems for a carbon-free delivery network.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4 glass-card-hover">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/35">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Guaranteed Quality</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            All kitchen partners undergo continuous hygiene standard evaluations and only select fresh, grade-A natural ingredients.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4 glass-card-hover">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/35">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Customer Devotion</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            A specialized support framework ready to assist 24/7, keeping your hunger satisfied with hot, high-quality plates.
          </p>
        </div>
      </div>
    </div>
  );
};
