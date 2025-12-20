'use client'

import React, { Suspense, lazy, useState, useEffect } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className={className}>
        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_70%)] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-neutral-900/10">
            <span className="loader"></span>
          </div>
        }
      >
        <Spline
          scene={scene}
          className="w-full h-full"
        />
      </Suspense>
    </div>
  )
}