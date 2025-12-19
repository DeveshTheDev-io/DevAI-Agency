
'use client'

import React from 'react';
import { SplineScene } from "./splite";
import { Card } from "./card"
import { Spotlight } from "./spotlight"
 
export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden border-none rounded-none md:rounded-3xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
          <div className="inline-block px-3 py-1 rounded-full border border-neutral-800 text-xs font-medium text-neutral-400 mb-6 w-fit bg-neutral-900/50">
            Dev AI Agency: Next-Gen Solutions
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
            The Future of <br/>AI Engineering
          </h1>
          <p className="mt-6 text-neutral-400 max-w-lg text-lg leading-relaxed">
            We build autonomous AI agents and integrated systems that don't just chat, but <strong>execute</strong>. Bring your UI to life with beautiful 3D scenes and intelligent automation.
          </p>
          <div className="mt-10 flex gap-4">
            <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 border border-neutral-700 text-white font-bold rounded-full hover:bg-neutral-900 transition-colors">
              View Plans
            </button>
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
