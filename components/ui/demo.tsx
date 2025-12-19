'use client'

import React from 'react';
import { SplineScene } from "./spline";
import { Card } from "./card"
import { Spotlight } from "./spotlight"
import { ChevronRight, Cpu, Code2, Globe, Rocket } from "lucide-react";
 
interface SplineSceneBasicProps {
  onCtaClick?: () => void;
}

export function SplineSceneBasic({ onCtaClick }: SplineSceneBasicProps) {
  return (
    <div className="w-full min-h-[85vh] md:min-h-[90vh] bg-black relative overflow-hidden flex items-center justify-center">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full w-full max-w-[1600px] mx-auto z-10">
        {/* Left content */}
        <div className="flex-1 p-8 md:p-12 lg:p-20 flex flex-col justify-center">
          <div className="inline-block px-3 py-1 rounded-full border border-neutral-800 text-xs font-medium text-neutral-400 mb-8 w-fit bg-neutral-900/50 backdrop-blur-md">
            Dev A.I Agency: Premier Engineering Forge
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-[1.1] tracking-tight">
            Engineering The <br/>Future of Labor
          </h1>
          <p className="mt-8 text-neutral-400 max-w-lg text-lg md:text-xl leading-relaxed">
            Specialized in building <strong>Autonomous Agents</strong>, <strong>SaaS Scale-ups</strong>, and <strong>Modernizing Legacy Systems</strong>. We engineer production-ready AI ecosystems.
          </p>
          
          {/* Quick Services Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { label: "AI Agents", icon: Cpu },
              { label: "SaaS Forge", icon: Globe },
              { label: "Code Catalysts", icon: Code2 },
              { label: "MVP Launch", icon: Rocket }
            ].map((service, i) => (
              <div key={i} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                <service.icon className="w-3.5 h-3.5 text-purple-400" />
                {service.label}
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
            <button 
              onClick={onCtaClick}
              className="group relative px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
            >
              Let's work together
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-3 px-6 py-3 rounded-full border border-neutral-800/50 bg-neutral-900/20 backdrop-blur-sm select-none">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold text-emerald-500/90 tracking-[0.15em] uppercase">
                Available for projects
              </span>
            </div>
          </div>
        </div>

        {/* Right content - Spline Scene */}
        <div className="flex-1 relative min-h-[400px] md:min-h-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10 pointer-events-none md:block hidden" />
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}