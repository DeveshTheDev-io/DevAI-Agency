'use client'

import React, { Suspense, lazy, useState, useEffect } from 'react'

// Lazy load the Spline component to avoid blocking the main thread
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Simple error handler for Spline crashes
  if (hasError || !isMounted) {
    return <div className={className} />;
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
          onError={() => {
            console.error("Spline load failed. Reverting to empty container.");
            setHasError(true);
          }}
        />
      </Suspense>
    </div>
  )
}