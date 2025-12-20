import React from "react";
import { motion } from "framer-motion";
import { Button } from "./button";

export function FloatingPaths({ position }: { position: number }) {
    // Optimized for visibility and performance
    const paths = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 20 * position} -${189 + i * 20}C-${
            380 - i * 20 * position
        } -${189 + i * 20} -${312 - i * 20 * position} ${216 - i * 20} ${
            152 - i * 20 * position
        } ${343 - i * 20}C${616 - i * 20 * position} ${470 - i * 20} ${
            684 - i * 20 * position
        } ${875 - i * 20} ${684 - i * 20 * position} ${875 - i * 20}`,
        width: 0.8 + i * 0.1,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none will-change-transform">
            <svg
                className="w-full h-full text-white/30"
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
                        strokeOpacity={0.15 + path.id * 0.04}
                        initial={{ pathLength: 0.1, opacity: 0 }}
                        animate={{
                            pathLength: [0.2, 0.6, 0.2],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 12 + Math.random() * 8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
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
        <div className="relative w-full flex items-center justify-center overflow-hidden py-16 md:py-32 transform-gpu">
            <div className="absolute inset-0 z-0 opacity-100">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-10 tracking-tighter leading-none">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-3 md:mr-6 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: wordIndex * 0.05 + letterIndex * 0.02,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block text-transparent bg-clip-text 
                                        bg-gradient-to-b from-white to-white/60"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    <div
                        className="inline-block group relative bg-white/10 p-px rounded-2xl backdrop-blur-md 
                        overflow-hidden"
                    >
                        <Button
                            variant="ghost"
                            onClick={onButtonClick}
                            className="rounded-2xl px-8 py-6 md:px-10 md:py-8 text-lg font-bold 
                            bg-white text-black hover:bg-neutral-200 transition-all duration-300"
                        >
                            <span>Initiate Forge</span>
                            <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}