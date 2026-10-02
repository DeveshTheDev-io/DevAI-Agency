'use client'

import React, { useEffect } from 'react';
import { motion } from "framer-motion";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#________0101XYZ%";

function GlitchWordDecoder({
  text,
  startDelay = 0,
  highlightWord = "24/7.",
  className = "",
  highlightClassName = "font-semibold text-white underline decoration-cyan-400/60 underline-offset-4"
}: {
  text: string;
  startDelay?: number;
  highlightWord?: string;
  className?: string;
  highlightClassName?: string;
}) {
  const words = React.useMemo(() => text.split(" "), [text]);
  const [decodedCount, setDecodedCount] = React.useState(0);
  const [glitchWord, setGlitchWord] = React.useState("");

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      let currentIdx = 0;
      let tick = 0;

      intervalId = setInterval(() => {
        if (currentIdx >= words.length) {
          clearInterval(intervalId);
          setDecodedCount(words.length);
          setGlitchWord("");
          return;
        }

        const target = words[currentIdx];
        tick++;

        // Generate scrambled glitch characters matching length
        const scrambled = target
          .split("")
          .map((ch) => {
            if (Math.random() > 0.6) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");

        setGlitchWord(scrambled);

        // Every 3 ticks (~120ms), decode and lock the word
        if (tick >= 3) {
          currentIdx++;
          setDecodedCount(currentIdx);
          tick = 0;
        }
      }, 40);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [words, startDelay]);

  return (
    <span className={className}>
      {words.map((word, idx) => {
        if (idx < decodedCount) {
          const isHighlighted = word === highlightWord;
          return (
            <span
              key={idx}
              className={isHighlighted ? highlightClassName : ""}
            >
              {word}{" "}
            </span>
          );
        } else if (idx === decodedCount && glitchWord) {
          return (
            <span
              key={idx}
              className="text-cyan-300 font-mono tracking-wider drop-shadow-[0_0_10px_#22d3ee] inline-block scale-105"
            >
              {glitchWord}{" "}
            </span>
          );
        } else {
          return (
            <span key={idx} className="opacity-0 select-none">
              {word}{" "}
            </span>
          );
        }
      })}
    </span>
  );
}

export function SplineSceneBasic({ onCtaClick, onServicesClick }: { onCtaClick?: () => void, onServicesClick?: () => void }) {
  useEffect(() => {
    // Dynamically inject Space Grotesk for an ultra-modern, cyberpunk/tech AI agency look
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div 
      className="relative w-full h-screen bg-[#02060f] overflow-hidden flex flex-col items-center justify-center" 
      style={{ fontFamily: '"Space Grotesk", system-ui, -apple-system, sans-serif' }}
    >
      
      {/* ── BACKGROUND VIDEO ── */}
      <video 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{ objectPosition: '50% 50%', backgroundColor: '#03060c' }}
        autoPlay muted loop playsInline preload="auto" aria-hidden="true"
        poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4"
      />

      {/* ── VEIL ── */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(140% 60% at 50% 40%, rgba(6,10,18,0.16) 0%, rgba(6,10,18,0.057) 50%, rgba(6,10,18,0) 100%),
            linear-gradient(180deg, rgba(6,10,18,0) 45%, rgba(6,10,18,0.10) 100%)
          `
        }}
      />

      {/* ── HERO CONTENT ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-[1200px] mx-auto" style={{ marginTop: '5vh' }}>
        
        {/* Available for Projects Badge with Green Blinking Light */}
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mb-5 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.25)]"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_10px_#10b981]"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-emerald-300 font-semibold">
            Available for projects
          </span>
        </motion.div>

        {/* Title */}
        <h1 className="text-[38px] sm:text-[56px] md:text-[72px] lg:text-[82px] text-white tracking-tight leading-[1.08] mb-8 font-bold drop-shadow-2xl">
          <motion.span 
            initial={{ clipPath: 'inset(-100% 0 100% 0)', y: 24, opacity: 0 }}
            animate={{ clipPath: 'inset(-100% 0 -100% 0)', y: 0, opacity: 1 }}
            transition={{ duration: 0.85, ease: [0.16,1,0.3,1], delay: 0.32 }}
            className="block text-slate-200/95 font-medium tracking-tight text-[28px] sm:text-[40px] md:text-[52px] mb-1"
          >
            The vision of engineering is
          </motion.span>
          <motion.span 
            initial={{ scale: 0.92, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.16,1,0.3,1], delay: 0.44 }}
            className="relative inline-block font-black tracking-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_35px_rgba(34,211,238,0.55)]">
              HUMAN + A.I
            </span>
            {/* Subtle high-tech underline pulse */}
            <motion.span 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, ease: [0.16,1,0.3,1], delay: 0.65 }}
              className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]"
            />
          </motion.span>
        </h1>

        {/* Subtext HUD Container with Word-by-Word Glitch Decoding Effect */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.25,0.8,0.35,1], delay: 0.7 }}
          className="relative group mb-10 max-w-2xl mx-auto px-7 py-6 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden"
        >
          {/* Cybernetic HUD Corner Accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/70" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/70" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/70" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/70" />

          <p className="text-[17px] sm:text-[19px] md:text-[21px] text-slate-100 leading-relaxed font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            <GlitchWordDecoder
              text="Forging autonomous neural architectures that operate 24/7."
              startDelay={750}
              highlightWord="24/7."
            />
          </p>
          <p className="text-[15px] sm:text-[17px] md:text-[18px] text-cyan-200/90 font-mono tracking-wide mt-2">
            <GlitchWordDecoder
              text="Welcome to the final iteration of software engineering."
              startDelay={1750}
            />
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16,1,0.3,1], delay: 0.94 }}
          className="flex flex-col sm:flex-row items-center gap-5"
        >
          <button
            onClick={onCtaClick}
            className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-base sm:text-lg tracking-wide rounded-xl shadow-[0_0_35px_rgba(34,211,238,0.45)] hover:shadow-[0_0_55px_rgba(34,211,238,0.75)] hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 font-bold">Connect with us</span>
            <svg className="w-[15px] h-[11px] relative z-10 flex-none stroke-black transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 16 11" fill="none" aria-hidden="true" style={{ strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
              <path d="M0 5.5 H14.6 M10.3 1.2 L14.9 5.5 L10.3 9.8" />
            </svg>
          </button>
          
          <button
            onClick={onServicesClick}
            className="group relative inline-flex items-center justify-center px-9 py-4 bg-slate-900/60 text-white font-semibold text-base sm:text-lg tracking-wide rounded-xl border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all hover:scale-105 active:scale-95 backdrop-blur-xl"
          >
            <span className="group-hover:text-cyan-200 transition-colors">Services</span>
          </button>
        </motion.div>

        {/* Features List */}
        <ul className="grid grid-cols-2 lg:flex lg:flex-wrap justify-center gap-x-6 gap-y-4 lg:gap-12 mt-16 w-full max-w-3xl">
          {[
            { text: "Autonomous Agents", delay: 1.08 },
            { text: "Custom AI Models", delay: 1.15 },
            { text: "Seamless Integrations", delay: 1.22 },
            { text: "24/7 Operations", delay: 1.29 }
          ].map((item, i) => (
            <motion.li 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25,0.8,0.35,1], delay: item.delay }}
              className="flex items-center gap-3 text-[13px] md:text-[14.5px] text-[#e2ebf5]"
              style={{ fontWeight: 534, letterSpacing: '-0.05em' }}
            >
              <svg className="w-[9px] h-[16px] flex-none stroke-[rgba(214,232,250,0.90)]" viewBox="0 0 11 20" fill="none" style={{ strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                <path d="M1.15 1.15 L9.6 10 L1.15 18.85" />
              </svg>
              <span>{item.text}</span>
            </motion.li>
          ))}
        </ul>

        {/* Vertical Rule */}
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.55, ease: [0.16,1,0.3,1], delay: 1.34 }}
          className="w-[1px] h-10 mt-12 origin-top"
          style={{
            background: 'linear-gradient(180deg, rgba(186,200,214,0.70) 0%, rgba(206,220,232,0.92) 52%, rgba(182,198,212,0.68) 100%)'
          }}
        />

      </div>
      
      {/* Bottom fade into the next section for seamless merging */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none z-30" />
    </div>
  );
}