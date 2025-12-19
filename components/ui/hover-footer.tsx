
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Bot
} from "lucide-react";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer", className)}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="25%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="75%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold dark:stroke-neutral-800"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-purple-500 font-[helvetica] text-7xl font-bold 
        dark:stroke-purple-500/50"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};


export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #0F0F1166 50%, #8b5cf611 100%)",
      }}
    />
  );
};

export function HoverFooter({ 
  onNavigate, 
  onScroll 
}: { 
  onNavigate: (p: 'home' | 'about') => void, 
  onScroll: (id: string) => void 
}) {
  const footerLinks = [
    {
      title: "Solutions",
      links: [
        { label: "AI Agents", onClick: () => onScroll('agents') },
        { label: "Project Forge", onClick: () => onScroll('projects') },
        { label: "Pricing Plans", onClick: () => onScroll('plans') },
        { label: "Technical Audit", onClick: () => onScroll('cta'), pulse: true },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Our Process", onClick: () => onScroll('workflow') },
        { label: "Meet the Team", onClick: () => onNavigate('about') },
        { label: "Case Studies", href: "#" },
        { label: "Agent Status", href: "#", pulse: true },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail size={18} className="text-purple-400" />,
      text: "hello@devai.agency",
      href: "mailto:hello@devai.agency",
    },
    {
      icon: <Phone size={18} className="text-purple-400" />,
      text: "+91 83193 94103",
      href: "tel:+918319394103",
    },
    {
      icon: <MapPin size={18} className="text-purple-400" />,
      text: "45 Kailash Vihar, City Center, Gwalior",
    },
  ];

  const socialLinks = [
    { icon: <Twitter size={20} />, label: "Twitter", href: "#" },
    { icon: <Linkedin size={20} />, label: "Linkedin", href: "#" },
    { icon: <Github size={20} />, label: "Github", href: "#" },
    { icon: <Globe size={20} />, label: "Web", href: "#" },
  ];

  return (
    <footer className="bg-[#0F0F11]/40 relative h-fit rounded-t-[3rem] overflow-hidden mt-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto p-10 md:p-20 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-6">
            <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => onNavigate('home')}
            >
              <div className="relative w-8 h-8 flex items-center justify-center group-hover:rotate-90 transition-transform duration-700">
                <span className="absolute w-2 h-2 rounded-full bg-purple-500 top-0 left-1/2 transform -translate-x-1/2 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
                <span className="absolute w-2 h-2 rounded-full bg-blue-500 left-0 top-1/2 transform -translate-y-1/2 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                <span className="absolute w-2 h-2 rounded-full bg-emerald-500 right-0 top-1/2 transform -translate-y-1/2 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                <span className="absolute w-2 h-2 rounded-full bg-amber-500 bottom-0 left-1/2 transform -translate-x-1/2 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></span>
              </div>
              <div className="flex flex-col items-baseline leading-none select-none">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold tracking-tighter text-white">Dev</span>
                  <span className="text-xl font-black tracking-tighter bg-gradient-to-br from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">A.I</span>
                </div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 uppercase opacity-60">Agency</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-neutral-500 max-w-xs">
              Pioneering the next generation of autonomous digital labor. We design, build, and scale AI-native systems.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-8">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label} className="relative flex items-center">
                    {link.onClick ? (
                        <button
                          onClick={link.onClick}
                          className="text-neutral-500 hover:text-white transition-colors text-sm font-medium text-left"
                        >
                          {link.label}
                        </button>
                    ) : (
                        <a
                          href={link.href}
                          className="text-neutral-500 hover:text-white transition-colors text-sm font-medium"
                        >
                          {link.label}
                        </a>
                    )}
                    {link.pulse && (
                      <span className="ml-2 flex h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-8">
              Connect
            </h4>
            <ul className="space-y-5">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-neutral-500 hover:text-white transition-colors text-sm font-medium"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-neutral-500 text-sm font-medium">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800/50 mt-16 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs space-y-6 md:space-y-0">
                {/* Social icons */}
                <div className="flex space-x-6 text-neutral-500">
                    {socialLinks.map(({ icon, label, href }) => (
                    <a
                        key={label}
                        href={href}
                        aria-label={label}
                        className="hover:text-purple-400 transition-colors bg-neutral-900 p-2.5 rounded-xl border border-neutral-800"
                    >
                        {icon}
                    </a>
                    ))}
                </div>

                {/* Copyright */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 text-neutral-600 font-medium">
                    <p>&copy; {new Date().getFullYear()} DEVA.I AGENCY. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-6 uppercase tracking-tighter">
                        <a href="#" className="hover:text-neutral-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-neutral-400 transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Text hover effect */}
      <div className="lg:flex hidden h-[25rem] -mt-40 -mb-28 pointer-events-none opacity-50">
        <TextHoverEffect text="DEVA.I" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
