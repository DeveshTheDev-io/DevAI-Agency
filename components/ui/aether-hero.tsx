import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

export type AetherHeroProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void; // Added for modal trigger
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  align?: 'left' | 'center' | 'right';
  maxWidth?: number;
  overlayGradient?: string;
  textColor?: string;
  fragmentSource?: string;
  dprMax?: number;
  clearColor?: [number, number, number, number];
  height?: string | number;
  className?: string;
  ariaLabel?: string;
};

const DEFAULT_FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
#define FC gl_FragCoord.xy
#define R resolution
#define T time
#define MN min(R.x,R.y)
float pattern(vec2 uv) {
  float d=.0;
  for (float i=.0; i<3.; i++) {
    uv.x+=sin(T*(1.+i)+uv.y*1.5)*.2;
    d+=.005/abs(uv.x);
  }
  return d;	
}
vec3 scene(vec2 uv) {
  vec3 col=vec3(0);
  uv=vec2(atan(uv.x,uv.y)*2./6.28318,-log(length(uv))+T);
  for (float i=.0; i<3.; i++) {
    int k=int(mod(i,3.));
    col[k]+=pattern(uv+i*6./MN);
  }
  return col;
}
void main() {
  vec2 uv=(FC-.5*R)/MN;
  vec3 col=vec3(0);
  float s=10., e=9e-4;
  col+=e/(sin(uv.x*s)*cos(uv.y*s));
  uv.y+=R.x>R.y?.5:.5*(R.y/R.x);
  col+=scene(uv);
  O=vec4(col,1.);
}`;

const VERT_SRC = `#version 300 es
precision highp float;
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }
`;

export function AetherHero({
  title = 'Forge the Future.',
  subtitle = '',
  ctaLabel = '',
  ctaHref = '#',
  onCtaClick,
  secondaryCtaLabel,
  secondaryCtaHref,
  align = 'center',
  maxWidth = 960,
  overlayGradient = 'linear-gradient(180deg, rgba(0,0,0,0.9), transparent)',
  textColor = '#ffffff',
  fragmentSource = DEFAULT_FRAG,
  dprMax = 1.0, // Conservative for better perf
  height = '100vh',
  className = '',
}: AetherHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (isMobile) return () => window.removeEventListener('resize', checkMobile);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { 
      alpha: false, 
      antialias: false, 
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false
    });
    
    if (!gl) return;

    const compileShader = (gl: WebGL2RenderingContext, src: string, type: number) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
      }
      return sh;
    };

    const v = compileShader(gl, VERT_SRC, gl.VERTEX_SHADER);
    const f = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, v);
    gl.attachShader(prog, f);
    gl.linkProgram(prog);

    const verts = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    gl.useProgram(prog);
    const posLoc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uniTime = gl.getUniformLocation(prog, 'time');
    const uniRes = gl.getUniformLocation(prog, 'resolution');

    let rafId: number;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprMax);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    
    fit();
    window.addEventListener('resize', fit);

    const loop = (now: number) => {
      gl.uniform2f(uniRes, canvas.width, canvas.height);
      gl.uniform1f(uniTime, now * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', fit);
      window.removeEventListener('resize', checkMobile);
      cancelAnimationFrame(rafId);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [fragmentSource, dprMax, isMobile]);

  return (
    <section
      className={cn("relative overflow-hidden bg-black", className)}
      style={{ height }}
    >
      {!isMobile ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.3),transparent_70%)] animate-pulse" />
      )}
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{ background: overlayGradient }}
      />
      <div className="relative z-10 h-full flex items-center justify-center p-8 text-center">
        <div style={{ maxWidth, color: textColor }}>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">{title}</h1>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
          {ctaLabel && (
            <div className="mt-12">
              {onCtaClick ? (
                <button 
                  onClick={onCtaClick}
                  className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-neutral-200 transition-all active:scale-95"
                >
                  {ctaLabel}
                </button>
              ) : (
                <a href={ctaHref} className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-neutral-200 transition-all inline-block">
                  {ctaLabel}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}