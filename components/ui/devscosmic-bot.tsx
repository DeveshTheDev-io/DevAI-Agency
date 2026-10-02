'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ChevronDown,
  RefreshCw,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  Layers,
  MessageSquare,
  Zap,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DevscosmicBotProps {
  onOpenInquiry?: (source: string) => void;
  onScrollTo?: (sectionId: string) => void;
  onNavigate?: (page: 'home' | 'about' | 'agents') => void;
  plans?: any[];
  courses?: any[];
  agents?: any[];
  projects?: any[];
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    actionType: 'inquiry' | 'scroll' | 'navigate' | 'link';
    target: string;
  }[];
}

const INITIAL_SUGGESTIONS = [
  { label: '💰 Packages & Pricing', query: 'What packages and pricing do you offer?' },
  { label: '🤖 Autonomous Agents', query: 'Tell me about your autonomous AI agents.' },
  { label: '🎓 AI Courses & Placement', query: 'What AI courses do you provide?' },
  { label: '📅 How to Book a Call?', query: 'How do I book a consultation or project audit?' },
  { label: '🚀 Live Portfolio & Projects', query: 'Show me what you have built and live client projects.' }
];

export function DevscosmicBot({
  onOpenInquiry,
  onScrollTo,
  onNavigate,
  plans = [],
  courses = [],
  agents = [],
  projects = []
}: DevscosmicBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Welcome to **Devscosmic.AI**! I'm your autonomous AI Agency Guide.\n\nI can help you with:\n• **Service Packages & Pricing** (from ₹4,999 to Enterprise)\n• **Autonomous AI Agents** (Email, Lead Gen, 24/7 Support)\n• **AI Courses & 100% Placement** (Prompting, ML, Web Design)\n• **Live Client Work** (Weight Mantra, GlowMitra, etc.)\n• **Instant Consultation & Booking**\n\nWhat can I assist you with today?",
      timestamp: 'Just now',
      actions: [
        { label: '📅 Book Consultation', actionType: 'inquiry', target: 'AI Bot Consultation Request' },
        { label: '⚡ View Packages', actionType: 'scroll', target: 'plans' }
      ]
    }
  ]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Hide unread badge when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setShowTooltip(false);
    }
  }, [isOpen]);

  // Auto dismiss tooltip after 8s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Smart Knowledge Retrieval & Intent Resolution
  const generateBotReply = (query: string): { text: string; actions?: ChatMessage['actions'] } => {
    const q = query.toLowerCase().trim();

    // 1. BOOKING / CONSULTATION / CONTACT
    if (
      q.includes('book') ||
      q.includes('call') ||
      q.includes('consult') ||
      q.includes('contact') ||
      q.includes('hire') ||
      q.includes('audit') ||
      q.includes('talk') ||
      q.includes('meeting')
    ) {
      return {
        text: `### 📅 Book a Technical Consultation with Devscosmic
We offer direct **1-on-1 Technical Audits & Discovery Calls** with our lead architects to evaluate your requirements, design your AI blueprint, and plan rapid deployment.

**Booking Options:**
1. **Instant Inquiry / Proposal:** Submit our 60-second project questionnaire.
2. **Technical Audit Protocol:** Deep-dive audit into your existing architecture and AI integration opportunities.

Click below to open the booking console immediately!`,
        actions: [
          { label: '📅 Open Booking Form', actionType: 'inquiry', target: 'Technical Audit Protocol' },
          { label: '💬 General Inquiry', actionType: 'inquiry', target: 'General Bot Booking' }
        ]
      };
    }

    // 2. PRICING / PLANS / PACKAGES / COST
    if (
      q.includes('price') ||
      q.includes('pricing') ||
      q.includes('cost') ||
      q.includes('plan') ||
      q.includes('package') ||
      q.includes('fee') ||
      q.includes('inr') ||
      q.includes('₹')
    ) {
      return {
        text: `### ⚡ Devscosmic Service Packages & Pricing
All packages include production-grade engineering, modern AI integration, and zero-downtime deployment:

• **Freelancer Kickstart — ₹4,999**
  *1-Page React Website, Vercel edge deployment, Contact Form, 3-day turnaround.*
• **Startup Launch MVP — ₹14,999**
  *React + Supabase MVP, Auth & Dashboard, 1 AI Feature, 1-week delivery.*
• **E-Commerce AI Store — ₹29,999 (Most Popular 🔥)**
  *Full D2C store, Razorpay/UPI, AI product recommendations, inventory panel, WhatsApp alerts.*
• **AI Agent Forge — ₹39,999**
  *Custom LLM autonomous agent, GPT-4/Gemini backend, WhatsApp/Web chat, knowledge base.*
• **Full-Stack SaaS Pro — ₹49,999**
  *Production SaaS with roles, billing, admin dashboard, 2-3 weeks.*
• **EdTech Platform — ₹59,999** | **Healthcare Suite — ₹74,999** | **Real Estate AI — ₹44,999**
• **Enterprise Custom — Bespoke Neural Architectures & Custom SLAs.**`,
        actions: [
          { label: '⚡ View All Packages', actionType: 'scroll', target: 'plans' },
          { label: '💼 Select a Package', actionType: 'inquiry', target: 'Package Selection Inquiry' }
        ]
      };
    }

    // 3. COURSES / ACADEMY / LEARNING / PLACEMENT / BATCH
    if (
      q.includes('course') ||
      q.includes('academy') ||
      q.includes('learn') ||
      q.includes('study') ||
      q.includes('placement') ||
      q.includes('admission') ||
      q.includes('student') ||
      q.includes('certificate') ||
      q.includes('prompting') ||
      q.includes('ml') ||
      q.includes('python')
    ) {
      return {
        text: `### 🎓 Devscosmic AI Mastery Academy (Batch 2026)
Hands-on, industry-recognized training with **100% Placement Support**:

1. **AI Prompting Mastery (4 Weeks)** — Control Gemini & GPT-4 for complex business workflows and agentic logic.
2. **AI-Driven Web Design (6 Weeks)** — Figma-to-code, generative design, high-conversion responsive interfaces.
3. **Applied ML & LLMs (12 Weeks)** — Fine-tuning open models, RAG vector pipelines, production deployment.
4. **Python for AI Ops (8 Weeks)** — Data processing, REST APIs, autonomous background daemons.
5. **AI Data Science (10 Weeks)** — Big data forecasting, AI analytics, and statistical models.

*✨ Early bird admission: Up to **40% Off** scholarship available for graduates & professionals.*`,
        actions: [
          { label: '🎓 Explore Courses', actionType: 'scroll', target: 'courses' },
          { label: '📝 Apply for Admission', actionType: 'inquiry', target: 'Course Admission Application' }
        ]
      };
    }

    // 4. AGENTS / AUTONOMOUS WORKFLOWS / BOTS
    if (
      q.includes('agent') ||
      q.includes('bot') ||
      q.includes('autonomous') ||
      q.includes('automate') ||
      q.includes('automation') ||
      q.includes('neural') ||
      q.includes('24/7')
    ) {
      return {
        text: `### 🤖 Autonomous Business AI Agents
We forge autonomous neural agents that replace repetitive manual tasks and operate 24/7:

• **Email Automation Pro:** Autonomous inbox triage, drafting, context-aware lead replies in your brand voice.
• **Calendar Architect:** Next-gen scheduling, conflict resolution, and pre-qualifying leads with zero human overhead.
• **Lead Gen Scout:** Scours web ecosystems for high-intent leads, verifies contact data, updates your CRM live.
• **24/7 Support Oracle:** Multilingual live resolution for customer inquiries linked to your company knowledge base.

You can browse our complete live agents directory with ready-to-deploy solutions!`,
        actions: [
          { label: '🤖 Browse All Agents', actionType: 'navigate', target: 'agents' },
          { label: '⚡ Build Custom Agent', actionType: 'inquiry', target: 'Custom Agent Build Request' }
        ]
      };
    }

    // 5. PORTFOLIO / CLIENTS / WHAT WE'VE BUILT / WEIGHT MANTRA / GLOWMITRA
    if (
      q.includes('build') ||
      q.includes('portfolio') ||
      q.includes('project') ||
      q.includes('work') ||
      q.includes('client') ||
      q.includes('sample') ||
      q.includes('weight') ||
      q.includes('glow') ||
      q.includes('mantra') ||
      q.includes('mitra')
    ) {
      return {
        text: `### 🚀 What We've Built Best — Live Client Work
Here are some of our flagship live applications:

• **🌿 Weight Mantra** ([weight-mantra.vercel.app](https://weight-mantra.vercel.app/))
  *High-performance health supplement & wellness e-commerce platform with smart BMI guidance, dietary catalog, and rapid checkout.*

• **💄 GlowMitra** ([glowmitra.co.in](https://www.glowmitra.co.in/))
  *Premier beauty salon, parlor & aesthetic wellness booking portal tailored exclusively for women and girls.*

• **🏔️ Uneplore Himalayas** ([uneplorehimalays.com](https://uneplorehimalays.com/))
  *Full-stack serverless travel booking platform with custom CMS and Framer Motion UI.*

• **✈️ TerraRoam Holidays** ([terra-roam-holidays.vercel.app](https://terra-roam-holidays.vercel.app/))
  *Client acquisition and vacation booking platform.*

• **🛍️ FRESHOGO** ([freshogo-in.vercel.app](https://freshogo-in.vercel.app/))
  *Modern fresh produce and localized grocery delivery app.*

• **🏠 SecureStayzz Girls PG** ([rajpg-omega.vercel.app](https://rajpg-omega.vercel.app/))
  *Premium accommodation and hostel management portal.*`,
        actions: [
          { label: '🌿 Open Weight Mantra', actionType: 'link', target: 'https://weight-mantra.vercel.app/' },
          { label: '💄 Open GlowMitra', actionType: 'link', target: 'https://www.glowmitra.co.in/' },
          { label: '🚀 View All Projects', actionType: 'scroll', target: 'projects' }
        ]
      };
    }

    // 6. TECH STACK / FRAMEWORKS / WHO ARE YOU
    if (
      q.includes('tech') ||
      q.includes('stack') ||
      q.includes('framework') ||
      q.includes('react') ||
      q.includes('python') ||
      q.includes('ai model') ||
      q.includes('who are you') ||
      q.includes('devscosmic')
    ) {
      return {
        text: `### ⚡ About Devscosmic.AI & Our Tech Arsenal
**Devscosmic** is an elite AI engineering agency. Our mission is **Human + A.I** — forging autonomous neural architectures that operate 24/7.

**Our Core Arsenal:**
• **Frontend:** Next.js 15, React 19, Vite, Tailwind CSS, Framer Motion.
• **AI & Intelligence:** DeepSeek, OpenAI GPT-4o, Google Gemini, Pinecone vector RAG, custom agentic workflows.
• **Backend & Cloud:** FastAPI (Python), Node.js, Supabase PostgreSQL, AWS, Vercel Edge.
• **Turnaround:** 3 days for Kickstart, 1-2 weeks for production SaaS/Store.`,
        actions: [
          { label: '💡 About The Agency', actionType: 'navigate', target: 'about' },
          { label: '📅 Initiate Audit', actionType: 'inquiry', target: 'Technical Audit Protocol' }
        ]
      };
    }

    // 7. DEFAULT HELPFUL FALLBACK
    return {
      text: `Thanks for asking! **Devscosmic.AI** specializes in building production-ready AI software, autonomous agents, modern web applications, and running the AI Mastery Academy.

How can I best guide you?
1. **View Service Packages & Pricing** (e.g. ₹4,999 – ₹74,999)
2. **Explore Autonomous AI Agents** (Email, Lead Gen, Support)
3. **Check Live Client Projects** (Weight Mantra, GlowMitra, Uneplore)
4. **Learn about AI Academy Courses** (100% placement support)
5. **Book a Direct Technical Audit / Consultation**

Pick an option below or ask me any specific question!`,
      actions: [
        { label: '⚡ Service Packages', actionType: 'scroll', target: 'plans' },
        { label: '🤖 Business Agents', actionType: 'navigate', target: 'agents' },
        { label: '📅 Book Consultation', actionType: 'inquiry', target: 'General Bot Booking' }
      ]
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate intelligent thinking & typing
    setTimeout(() => {
      const reply = generateBotReply(query);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: reply.text,
        timestamp: 'Just now',
        actions: reply.actions
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 550);
  };

  const handleActionClick = (action: { actionType: string; target: string }) => {
    if (action.actionType === 'inquiry') {
      if (onOpenInquiry) onOpenInquiry(action.target);
    } else if (action.actionType === 'scroll') {
      if (onScrollTo) onScrollTo(action.target);
    } else if (action.actionType === 'navigate') {
      if (onNavigate) onNavigate(action.target as any);
    } else if (action.actionType === 'link') {
      window.open(action.target, '_blank', 'noopener,noreferrer');
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: "Conversation reset! What can I help you explore regarding Devscosmic's services, pricing, courses, agents, or client projects?",
        timestamp: 'Just now',
        actions: [
          { label: '💰 Pricing Packages', actionType: 'scroll', target: 'plans' },
          { label: '📅 Book a Call', actionType: 'inquiry', target: 'AI Bot Consultation Request' }
        ]
      }
    ]);
  };

  return (
    <>
      {/* ── FLOATING TRIGGER BUTTON ── */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end">
        {/* Floating Tooltip Invitation */}
        <AnimatePresence>
          {!isOpen && showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="mb-3 px-3.5 py-2 rounded-2xl bg-neutral-900/90 border border-cyan-500/30 text-white text-xs font-medium shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(34,211,238,0.2)] backdrop-blur-xl cursor-pointer flex items-center gap-2 group hover:border-cyan-400 transition-all max-w-[85vw]"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="truncate">Ask <strong className="text-cyan-300">Devscosmic AI</strong></span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-neutral-400 hover:text-white ml-1 shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative group flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-neutral-950 via-slate-900 to-cyan-950 border border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all overflow-hidden"
          aria-label="Open AI Assistant"
        >
          {/* Subtle neon glow sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Green Status Beacon */}
          <div className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
          </div>

          <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
            {isOpen ? <X className="w-3.5 h-3.5" /> : <Bot className="w-3.5 sm:w-4 h-3.5 sm:h-4 animate-pulse" />}
          </div>

          <span className="text-white text-xs sm:text-sm font-bold tracking-wide">
            {isOpen ? 'Close' : 'Devscosmic AI'}
          </span>

          {hasUnread && !isOpen && (
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          )}
        </motion.button>
      </div>

      {/* ── CHATBOT MODAL WINDOW ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 sm:bottom-24 right-2 sm:right-6 left-2 sm:left-auto z-50 w-[calc(100vw-1rem)] sm:w-[420px] h-[540px] max-h-[78vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#030712]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(34,211,238,0.15)] overflow-hidden"
            style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 bg-neutral-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-neutral-900 shadow-[0_0_6px_#10b981]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-tight">Devscosmic AI</h3>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold">
                      v4.2
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-medium">Agency Intelligence • Online 24/7</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Reset Conversation"
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimize"
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2.5 border-b border-white/5 bg-black/30 overflow-x-auto no-scrollbar flex items-center gap-2">
              {INITIAL_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.query)}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/40 text-[11px] font-medium text-neutral-300 hover:text-cyan-200 transition-all flex items-center gap-1.5"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm no-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col',
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[88%] px-4 py-3 rounded-2xl whitespace-pre-line leading-relaxed text-[13px]',
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold rounded-tr-none shadow-[0_4px_15px_rgba(34,211,238,0.2)]'
                        : 'bg-neutral-900/80 border border-white/10 text-neutral-200 rounded-tl-none shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
                    )}
                  >
                    {/* Render bold and markdown highlights cleanly */}
                    {msg.text}
                  </div>

                  {/* Optional Action Buttons attached to Bot Message */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2.5 max-w-[90%]">
                      {msg.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-500/30 hover:border-cyan-400 text-cyan-200 text-xs font-semibold shadow-[0_0_10px_rgba(34,211,238,0.15)] transition-all hover:scale-105 active:scale-95"
                        >
                          <span>{act.label}</span>
                          {act.actionType === 'link' ? (
                            <ExternalLink className="w-3 h-3 text-cyan-400" />
                          ) : act.actionType === 'inquiry' ? (
                            <Calendar className="w-3 h-3 text-cyan-400" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-neutral-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-900/80 border border-white/10 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-neutral-400 ml-1">Analyzing agency knowledge...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-white/10 bg-neutral-950/90">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about plans, booking, courses, agents..."
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-neutral-900/90 border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 p-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black disabled:opacity-40 disabled:pointer-events-none hover:scale-105 active:scale-95 transition-all shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                  aria-label="Send Message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <div className="flex items-center justify-between px-2 pt-2 text-[10px] text-neutral-500">
                <span>Autonomous Assistant • Devscosmic.AI</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  Live Sync
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
