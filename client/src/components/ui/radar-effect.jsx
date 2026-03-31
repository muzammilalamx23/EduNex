import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import React from "react";

// Array of concentric rings (we'll render 5 rings for a cleaner look)
const rings = new Array(5).fill(1);
const RADAR_DUR = 8; // seconds
const ORBIT_DUR = 60; // seconds

export const Radar = ({ className, children }) => {
  return (
    <div
      className={twMerge(
        "relative flex h-[600px] w-[600px] items-center justify-center overflow-visible",
        className
      )}
    >
      <style>{`
        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-radar-spin {
          animation: radar-spin ${RADAR_DUR}s linear infinite;
        }
        @keyframes board-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes radar-ping {
          0%, 2% { 
            opacity: 1; 
            filter: brightness(1.5) drop-shadow(0 0 20px rgba(99,102,241,0.9)); 
            transform: translate(-50%, -50%) scale(1.15); 
          }
          15% { 
            opacity: 0.4; 
            filter: brightness(0.8) drop-shadow(0 0 5px rgba(99,102,241,0.3)); 
            transform: translate(-50%, -50%) scale(1); 
          }
          100% { 
            opacity: 0.1; 
            filter: brightness(0.4) drop-shadow(0 0 0 rgba(99,102,241,0)); 
            transform: translate(-50%, -50%) scale(0.95); 
          }
        }
      `}</style>
      
      {/* Static Concentric circles */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        {rings.map((_, idx) => (
          <div
            key={`ring-${idx}`}
            style={{
              position: 'absolute',
              height: `${(idx + 1) * 110}px`,
              width: `${(idx + 1) * 110}px`,
              border: `1px solid rgba(79, 70, 229, ${0.4 - (idx + 1) * 0.06})`,
              borderRadius: '50%',
              boxShadow: idx === rings.length - 1 ? 'inset 0 0 50px rgba(99,102,241,0.1)' : 'none',
            }}
          />
        ))}

        {/* Static Crosshairs */}
        <div className="absolute h-full w-[1px] bg-indigo-500/10" />
        <div className="absolute w-full h-[1px] bg-indigo-500/10" />
      </div>

      {/* Orbiting Container (spins slowly) */}
      <div 
        className="absolute inset-0 z-20"
        style={{ animation: `board-spin ${ORBIT_DUR}s linear infinite` }}
      >
        {/* Sweeping Wedge using conic gradient. Since it's inside the spinning board,
            its relatively fast radar-spin is added on top of the board-spin,
            keeping the exact 8s relative sync with the rotating children! */}
        <div
          className="absolute inset-0 z-40 rounded-full animate-radar-spin pointer-events-none"
          style={{ 
             background: 'conic-gradient(from 0deg at 50% 50%, rgba(99,102,241,0) 0%, rgba(99,102,241,0) 75%, rgba(99,102,241,0.3) 99%, rgba(139,92,246,0.8) 100%)' 
          }}
        >
          {/* Leading crisp line (starts at 12 o'clock center, points up) */}
          <div className="absolute left-1/2 bottom-1/2 w-[2px] h-[300px] bg-gradient-to-t from-transparent via-indigo-400 to-indigo-300 shadow-[0_0_20px_3px_rgba(99,102,241,0.8)] -translate-x-1/2" />
        </div>

        {/* RENDER THE ICONS PASSED AS CHILDREN (These orbit with the board) */}
        {children}
      </div>
    </div>
  );
};

export const OrbitIcon = ({ img, text, radius, angle }) => {
  // Angle 0 = Top (12 o'clock), increasing clockwise.
  const angleRad = (angle * Math.PI) / 180;
  
  const x = Math.sin(angleRad) * radius;
  const y = -Math.cos(angleRad) * radius;

  // Sync animation with the radar sweeping (duration = 8s).
  const timeHit = (angle / 360) * RADAR_DUR;
  const delay = timeHit - RADAR_DUR;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(0.95)`,
        animation: `radar-ping ${RADAR_DUR}s linear infinite`,
        animationDelay: `${delay}s`,
        opacity: 0.1,
        marginLeft: `${x}px`,
        marginTop: `${y}px`,
      }}
      className="z-50 group cursor-pointer"
    >
      {/* Counter-spin wrapper keeps the images permanently upright! */}
      <div 
         className="flex flex-col items-center justify-center space-y-2"
         style={{ animation: `counter-spin ${ORBIT_DUR}s linear infinite` }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/40 bg-[#09090b]/80 backdrop-blur-md p-2 transition-transform duration-300 group-hover:scale-125 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
           <img src={img} alt={text} className="h-full w-full object-contain" />
        </div>
        <div className="absolute top-[110%] w-max text-center text-[10px] sm:text-xs font-bold text-zinc-300 uppercase tracking-wider drop-shadow-md transition-all duration-300 group-hover:text-white">
          {text}
        </div>
      </div>
    </div>
  );
};
