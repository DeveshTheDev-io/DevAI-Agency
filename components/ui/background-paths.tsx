import React from "react";
import { motion } from "framer-motion";

export function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 20 * position} -${189 + i * 20}C-${
            380 - i * 20 * position
        } -${189 + i * 20} -${312 - i * 20 * position} ${216 - i * 20} ${
            152 - i * 20 * position
        } ${343 - i * 20}C${616 - i * 20 * position} ${470 - i * 20} ${
            684 - i * 20 * position
        } ${875 - i * 20} ${684 - i * 20 * position} ${875 - i * 20}`,
        width: 0.5 + i * 0.1,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none will-change-transform">
            <svg
                className="w-full h-full text-white/40"
                viewBox="0 0 696 316"
                fill="none"
                preserveAspectRatio="none"
            >
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.2 + path.id * 0.08}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: [0.2, 0.8, 0.2],
                            opacity: [0.3, 0.9, 0.3],
                        }}
                        transition={{
                            duration: 12 + path.id * 1.2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                            delay: path.id * 0.3,
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    title = "Background Paths",
    onButtonClick,
}: {
    title?: string;
    onButtonClick?: () => void;
}) {
    const words = title.split(" ");

    return (
        <div className="relative w-full flex items-center justify-center overflow-hidden py-20 md:py-36 transform-gpu">
            <div className="absolute inset-0 z-0 opacity-60">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            {/* Floating Code Snippets */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {[
                    { text: "const ai = new Agency();", top: "20%", left: "10%" },
                    { text: "deploy(nextGen);", top: "70%", left: "15%" },
                    { text: "while(true) innovate();", top: "15%", left: "80%" },
                    { text: "status: 'architecting'", top: "75%", left: "85%" },
                    { text: "import { Intelligence } from 'core';", top: "40%", left: "5%" },
                    { text: "optimize(throughput);", top: "60%", left: "90%" }
                ].map((snippet, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                            opacity: [0, 0.4, 0],
                            y: [0, -30, 0],
                            x: [0, Math.sin(i) * 20, 0]
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            delay: i * 1.5,
                            ease: "easeInOut"
                        }}
                        className="absolute text-[10px] font-mono text-purple-400/30 whitespace-nowrap"
                        style={{ top: snippet.top, left: snippet.left }}
                    >
                        {snippet.text}
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto"
                >
                    <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black mb-12 tracking-tighter leading-[0.85] font-mono">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-3 md:mr-5 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: wordIndex * 0.06 + letterIndex * 0.025,
                                            type: "spring",
                                            stiffness: 120,
                                            damping: 20,
                                        }}
                                        className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-purple-500/50"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h2>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <button
                            onClick={onButtonClick}
                            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95"
                            style={{
                                background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(59,130,246,0.15))',
                                border: '1px solid rgba(168,85,247,0.3)',
                                boxShadow: '0 0 40px rgba(168,85,247,0.15)',
                                color: '#fff',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 60px rgba(168,85,247,0.4)';
                                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,85,247,0.6)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(168,85,247,0.15)';
                                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,85,247,0.3)';
                            }}
                        >
                            <span>Initiate Forge</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}