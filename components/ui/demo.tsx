'use client'

import React from 'react';
import { Spotlight } from "./spotlight";
import { ChevronRight, Cpu, Code2, Globe, Rocket, ShoppingCart, Zap, TrendingUp, Package, Star } from "lucide-react";
import { motion } from "framer-motion";

interface SplineSceneBasicProps {
  onCtaClick?: () => void;
}

// ─── Floating UI Cards (E-Commerce + Code aesthetic) ───
const FLOAT_CARDS = [
  {
    icon: ShoppingCart,
    label: "Revenue Engine",
    value: "+340%",
    sub: "Conversion Rate",
    color: "blue",
    pos: "top-[12%] left-[4%]",
    delay: 0,
  },
  {
    icon: TrendingUp,
    label: "AI Insights",
    value: "98.2%",
    sub: "Prediction Accuracy",
    color: "emerald",
    pos: "top-[18%] right-[4%]",
    delay: 0.3,
  },
  {
    icon: Zap,
    label: "Deploy Speed",
    value: "4.2s",
    sub: "From Push to Live",
    color: "amber",
    pos: "bottom-[22%] left-[3%]",
    delay: 0.5,
  },
  {
    icon: Package,
    label: "Products Built",
    value: "120+",
    sub: "Shipped to Production",
    color: "purple",
    pos: "bottom-[18%] right-[4%]",
    delay: 0.2,
  },
];

const colorConfig: Record<string, { icon: string; bg: string; border: string; bar: string }> = {
  blue:    { icon: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    bar: "bg-blue-400"    },
  emerald: { icon: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", bar: "bg-emerald-400" },
  amber:   { icon: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   bar: "bg-amber-400"   },
  purple:  { icon: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/20",  bar: "bg-purple-400"  },
};

function FloatingCard({ card, i }: { card: typeof FLOAT_CARDS[0]; i: number }) {
  const c = colorConfig[card.color];
  return (
    <motion.div
      className={`absolute ${card.pos} hidden lg:block z-10`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { duration: 0.6, delay: card.delay + 0.5 },
        y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: card.delay },
      }}
    >
      <div className={`w-52 backdrop-blur-xl bg-black/50 border ${c.border} rounded-2xl p-4 shadow-2xl`}>
        <div className="flex items-center gap-2.5 mb-3">
          <div className={`w-8 h-8 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
            <card.icon className={`w-4 h-4 ${c.icon}`} />
          </div>
          <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">{card.label}</span>
        </div>
        <div className="text-white font-black text-2xl tracking-tight mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {card.value}
        </div>
        <div className="text-neutral-600 text-[9px] uppercase tracking-widest font-bold">{card.sub}</div>
        {/* Mini bar */}
        <div className="mt-3 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${c.bar} rounded-full`}
            initial={{ width: "0%" }}
            animate={{ width: "75%" }}
            transition={{ duration: 1.5, delay: card.delay + 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Background: Perspective Grid + Code Lines ───
function EcommerceBackground() {
  // Mock code lines floating in the BG
  const codeSnippets = [
    { text: "import { stripe } from '@/lib/stripe'", x: "8%",  y: "30%", opacity: 0.12 },
    { text: "const cart = useShoppingCart()",         x: "60%", y: "15%", opacity: 0.10 },
    { text: "await checkout.create({ lineItems })",   x: "5%",  y: "65%", opacity: 0.09 },
    { text: "model.predict(user.behavior)",           x: "58%", y: "72%", opacity: 0.11 },
    { text: "deploy({ target: 'production' })",       x: "20%", y: "85%", opacity: 0.08 },
    { text: "generateEmbedding(product.description)",x: "52%", y: "55%", opacity: 0.07 },
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep radial glows */}
      <div className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-purple-900/12 blur-[160px]" />
      <div className="absolute top-1/2 -left-1/4 w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-emerald-900/8 blur-[140px]" />

      {/* Perspective grid floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[55vh]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(168,85,247,0.15) 1px, transparent 1px),
            linear-gradient(to top, rgba(168,85,247,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(600px) rotateX(65deg) translateY(60px) scale(2.2)',
          transformOrigin: 'bottom center',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 80%)',
          opacity: 0.5,
        }}
      />

      {/* Floating code text */}
      {codeSnippets.map((s, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-[11px] text-purple-300 whitespace-nowrap hidden md:block"
          style={{ left: s.x, top: s.y, opacity: s.opacity }}
          animate={{ opacity: [s.opacity, s.opacity * 2.5, s.opacity] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
        >
          {s.text}
        </motion.div>
      ))}

      {/* Vertical scan lines */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-purple-500/60 to-transparent"
            style={{ left: `${20 + i * 22}%`, height: '30vh' }}
            animate={{ top: ['-30%', '130%'] }}
            transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: 'linear', delay: i * 1.2 }}
          />
        ))}
      </div>

      {/* Horizontal subtle lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '100% 80px',
        }}
      />
    </div>
  );
}

export function SplineSceneBasic({ onCtaClick }: SplineSceneBasicProps) {
  return (
    <div className="w-full min-h-screen bg-[#030303] relative overflow-hidden flex items-center justify-center">

      <EcommerceBackground />

      {/* Floating stat cards */}
      {FLOAT_CARDS.map((card, i) => (
        <FloatingCard key={i} card={card} i={i} />
      ))}

      <Spotlight className="-top-40 left-1/2 -translate-x-1/2 md:-top-20" />

      {/* ── CENTERED HERO CONTENT ── */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 pt-28 pb-16 w-full max-w-5xl mx-auto">

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 backdrop-blur-md mb-10"
        >
          <Star className="w-3 h-3 text-purple-400 fill-purple-400" />
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-[0.35em]">Dev A.I Agency · Engineering Forge</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.92] tracking-tighter mb-8 max-w-4xl"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          <span className="text-white">Engineering</span>{' '}
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">Unfair</span>
          <br />
          <span className="text-white">Advantages</span>{' '}
          <span className="bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">Through</span>
          <br />
          <span className="text-white">Applied AI.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.7 }}
          className="text-neutral-400 text-base md:text-xl leading-relaxed mb-12 max-w-2xl"
        >
          We architect <span className="text-white font-semibold">autonomous intelligence</span> into your business — turning your e-commerce, SaaS, and enterprise software into self-improving revenue machines.
        </motion.p>

        {/* Service pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {[
            { label: "AI Agents", icon: Cpu, color: "text-purple-400" },
            { label: "E-Commerce AI", icon: ShoppingCart, color: "text-blue-400" },
            { label: "SaaS Forge", icon: Globe, color: "text-emerald-400" },
            { label: "Code Catalyst", icon: Code2, color: "text-amber-400" },
            { label: "MVP Launch", icon: Rocket, color: "text-rose-400" }
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.07] text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 backdrop-blur-sm"
            >
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              {s.label}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onCtaClick}
            className="group relative px-10 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl hover:bg-neutral-100 transition-all flex items-center gap-3 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.12)]"
          >
            Initiate Project
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-3 px-6 py-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-md">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase">Available for Projects</span>
          </div>
        </motion.div>

        {/* Bottom trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center gap-8 mt-14 flex-wrap justify-center"
        >
          {[
            { val: "2.4k+", label: "Agents Deployed" },
            { val: "₹0", label: "Hidden Costs" },
            { val: "48hr", label: "Prototype Turnaround" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-white font-black text-2xl tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{item.val}</div>
              <div className="text-neutral-600 text-[9px] uppercase tracking-[0.25em] font-bold mt-0.5">{item.label}</div>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}