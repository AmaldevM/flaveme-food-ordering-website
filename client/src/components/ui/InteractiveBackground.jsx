import React, { useEffect, useState } from "react";

export const InteractiveBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Softly track mouse for a subtle interactive glow spot
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none">
      
      {/* 1. Dynamic Mesh Gradient Spheres (moving ambient blobs) */}
      <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-amber-400/8 to-orange-500/0 dark:from-indigo-600/12 dark:to-purple-800/0 blur-[130px] animate-[pulse_10s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-orange-600/6 to-yellow-500/0 dark:from-purple-600/12 dark:to-pink-800/0 blur-[130px] animate-[pulse_12s_ease-in-out_infinite_1s]"></div>
      <div className="absolute top-[30%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-rose-500/4 to-pink-500/0 dark:from-fuchsia-600/6 dark:to-violet-800/0 blur-[110px] animate-[pulse_8s_ease-in-out_infinite_2s]"></div>

      {/* 2. Interactive Mouse Follow Spotlight */}
      <div 
        className="absolute w-[350px] h-[350px] rounded-full bg-amber-500/3 dark:bg-violet-500/6 blur-[80px] transition-all duration-300 ease-out hidden md:block"
        style={{
          left: `${mousePos.x - 175}px`,
          top: `${mousePos.y - 175}px`,
        }}
      ></div>

      {/* 3. Floating Sparkles / Ambient Dust Particles */}
      <div className="absolute inset-0 opacity-40 dark:opacity-60">
        {Array.from({ length: 15 }).map((_, i) => {
          const size = Math.random() * 4 + 2;
          const left = Math.random() * 100;
          const delay = Math.random() * 15;
          const duration = Math.random() * 15 + 10;
          return (
            <div
              key={i}
              className="absolute bg-amber-400 dark:bg-indigo-300 rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                bottom: `-20px`,
                opacity: Math.random() * 0.5 + 0.2,
                animation: `float-up ${duration}s linear infinite ${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* 4. High-Tech Animated Flying Delivery Drones */}
      {/* Drone 1: High Altitude, Flies Left-to-Right */}
      <div className="absolute top-[20%] w-[120px] h-[70px] animate-[fly-right_22s_linear_infinite_delay] z-0">
        <DroneSVG color="#f59e0b" hasBox={true} />
      </div>

      {/* Drone 2: Low Altitude, Flies Right-to-Left */}
      <div className="absolute bottom-[25%] w-[90px] h-[55px] animate-[fly-left_28s_linear_infinite_5s] z-0">
        <DroneSVG color="#a78bfa" hasBox={false} />
      </div>

      {/* Injecting CSS Keyframes locally for compilation safety and easy management */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-up {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) translateX(50px) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes fly-right {
          0% {
            left: -150px;
            transform: translateY(0) rotate(5deg);
            opacity: 0;
          }
          2% {
            opacity: 0.85;
          }
          48% {
            transform: translateY(-20px) rotate(2deg);
          }
          50% {
            transform: translateY(0) rotate(-3deg);
          }
          95% {
            opacity: 0.85;
          }
          100% {
            left: 105vw;
            transform: translateY(-10px) rotate(-5deg);
            opacity: 0;
          }
        }

        @keyframes fly-left {
          0% {
            right: -150px;
            transform: scaleX(-1) translateY(0) rotate(5deg);
            opacity: 0;
          }
          2% {
            opacity: 0.75;
          }
          48% {
            transform: scaleX(-1) translateY(25px) rotate(1deg);
          }
          50% {
            transform: scaleX(-1) translateY(0) rotate(-4deg);
          }
          95% {
            opacity: 0.75;
          }
          100% {
            right: 105vw;
            transform: scaleX(-1) translateY(10px) rotate(-5deg);
            opacity: 0;
          }
        }

        @keyframes spin-rotor {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-rotor {
          transform-origin: center;
          animation: spin-rotor 0.1s linear infinite;
        }
      `}} />
    </div>
  );
};

// Custom High-Quality Vector Drone component
const DroneSVG = ({ color, hasBox }) => {
  return (
    <svg 
      viewBox="0 0 160 90" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-full h-full filter drop-shadow-md select-none pointer-events-none"
    >
      {/* Rotors Left & Right (Arm mounts) */}
      <path d="M15 35H145" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
      <path d="M40 35L80 50L120 35" fill="none" stroke="#64748b" strokeWidth="4" />
      
      {/* Left Propeller Mount */}
      <rect x="12" y="26" width="6" height="12" rx="2" fill="#334155" />
      {/* Right Propeller Mount */}
      <rect x="142" y="26" width="6" height="12" rx="2" fill="#334155" />

      {/* Spinning Blades (Left Propeller) */}
      <g className="animate-rotor" style={{ transformOrigin: "15px 26px" }}>
        <ellipse cx="15" cy="26" rx="28" ry="3" fill="#94a3b8" opacity="0.45" />
        <line x1="-10" y1="26" x2="40" y2="26" stroke="#475569" strokeWidth="1.5" />
      </g>

      {/* Spinning Blades (Right Propeller) */}
      <g className="animate-rotor" style={{ transformOrigin: "145px 26px" }}>
        <ellipse cx="145" cy="26" rx="28" ry="3" fill="#94a3b8" opacity="0.45" />
        <line x1="120" y1="26" x2="170" y2="26" stroke="#475569" strokeWidth="1.5" />
      </g>

      {/* Central Drone Chassis Body */}
      <circle cx="80" cy="50" r="18" fill="#1e293b" stroke="#334155" strokeWidth="3" />
      <rect x="74" y="44" width="12" height="12" rx="2" fill={color} />
      
      {/* Camera Eye (Glowing sensor) */}
      <circle cx="80" cy="56" r="3.5" fill="#10b981" className="animate-pulse" />

      {/* Cargo Payload (Food delivery box) */}
      {hasBox && (
        <g>
          {/* Support wires */}
          <line x1="72" y1="62" x2="65" y2="72" stroke="#64748b" strokeWidth="2" />
          <line x1="88" y1="62" x2="95" y2="72" stroke="#64748b" strokeWidth="2" />
          
          {/* Cargo Container */}
          <rect x="58" y="72" width="44" height="18" rx="4" fill="#ef4444" stroke="#dc2626" strokeWidth="2" />
          {/* Flave logo Fork/Spoon fork shape inside cargo */}
          <path d="M72 81H88" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="80" cy="81" r="2.5" fill="#ffffff" />
        </g>
      )}
    </svg>
  );
};
