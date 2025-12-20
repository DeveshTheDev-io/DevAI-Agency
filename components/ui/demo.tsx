'use client'

import React from 'react';
import { SplineScene } from "./spline";
import { Spotlight } from "./spotlight";
import { ChevronRight, Cpu, Code2, Globe, Rocket } from "lucide-react";
import { motion } from "framer-motion";
 
interface SplineSceneBasicProps {
  onCtaClick?: () => void;
}

export function SplineSceneBasic({ onCtaClick }: SplineSceneBasicProps) {
  return (
    <div className="w-full h-[90vh] md:h-screen bg-black relative overflow-hidden flex items-center justify-center">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
      />
      
      <div className="flex flex-col md:flex-row h-full w-full max-w-[1920px] mx-auto z-20 px-4 md:px-0">
        {/* Left content */}
        <div className="flex-1 p-6 md:p-16 lg:p-24 flex flex-col justify-center pt-24 md:pt-0">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 rounded-full border border-white/5 text-[9px] font-black text-neutral-500 mb-6 w-fit bg-neutral-900/30 backdrop-blur-md uppercase tracking-[0.3em]"
          >
            Dev A.I Agency: Engineering Forge
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 leading-[0.95] tracking-tighter font-['Space_Grotesk']"
          >
            Engineering <br/><span className="text-white">Autonomous Labor.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 md:mt-10 text-neutral-400 max-w-xl text-base md:text-xl lg:text-2xl leading-relaxed"
          >
            Specializing in <strong>Autonomous Agents</strong> and <strong>Enterprise Modernization</strong>. We build the infrastructure of tomorrow.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 md:mt-10 flex flex-wrap gap-2 md:gap-3"
          >
            {[
              { label: "AI Agents", icon: Cpu },
              { label: "SaaS Forge", icon: Globe },
              { label: "Code Catalyst", icon: Code2 },
              { label: "MVP Launch", icon: Rocket }
            ].map((service, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-neutral-900/40 border border-white/5 text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-400 group">
                <service.icon className="w-3.5 h-3.5 text-purple-500/50" />
                {service.label}
              </div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 md:mt-16 flex flex-col sm:flex-row items-center gap-4 md:gap-8"
          >
            <button 
              onClick={onCtaClick}
              className="w-full sm:w-auto px-10 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Initiate Project
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl border border-white/5 bg-neutral-900/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-black text-emerald-500/80 tracking-[0.2em] uppercase">
                Active Q1 2024
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right content - Spline Scene with Mobile Fallback */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 relative min-h-[300px] md:min-h-0"
        >
          <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-black via-black/40 to-transparent z-10 pointer-events-none md:block hidden" />
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </motion.div>
      </div>
    </div>
  )
}