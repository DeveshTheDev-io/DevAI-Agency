
'use client'

import React from 'react';
import { SplineScene } from "./splite";
import { Card } from "./card"
import { Spotlight } from "./spotlight"
import { ChevronRight, Cpu, Code2, Globe, Rocket } from "lucide-react";
 
interface SplineSceneBasicProps {
  onCtaClick?: () => void;
}

export function SplineSceneBasic({ onCtaClick }: SplineSceneBasicProps) {
  return (
    <Card className="w-full h-[600px] md:h-[550px] bg-black/[0.96] relative overflow-hidden border-none rounded-none md:rounded-3xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
          <div className="inline-block px-3 py-1 rounded-full border border-neutral-800 text-xs font-medium text-neutral-400 mb-6 w-fit bg-neutral-900/50">
            Dev A.I Agency: Premier Engineering Forge
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
            Engineering The <br/>Future of Labor
          </h1>
          <p className="mt-6 text-neutral-400 max-w-lg text-lg leading-relaxed">
            Specialized in building <strong>Autonomous Agents</strong>, <strong>SaaS Scale-ups</strong>, and <strong>Modernizing Legacy Systems</strong>. We engineer production-ready AI ecosystems that deliver measurable technical growth.
          </p>
          
          {/* Quick Services Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { label: "AI Agents", icon: Cpu },
              { label: "SaaS Forge", icon: Globe },
              { label: "Code Catalysts", icon: Code2 },
              { label: "MVP Launch", icon: Rocket }
            ].map((service, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                <service.icon className="w-3 h-3 text-purple-400" />
                {service.label}
              </div>
            ))}
          </div>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
            <button 
              onClick={onCtaClick}
              className="group relative px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
            >
              Let's work together
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-neutral-800/50 bg-neutral-900/20 backdrop-blur-sm select-none">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-500/90 tracking-[0.1em] uppercase">
                Available for projects
              </span>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative min-h-[300px]">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}
