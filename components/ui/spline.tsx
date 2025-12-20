'use client'

import React, { Suspense, lazy, useState, useEffect } from 'react'

// Use a safe wrapper for the Spline component
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent SSR mismatch by not rendering Spline on the server
  if (!isMounted) return <div className={className} />;

  if (isMobile) {
    return (
      <div className={className}>
        <div className="w-full h-full bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05),transparent_70%)] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-transparent">
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