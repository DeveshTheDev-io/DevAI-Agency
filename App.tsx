import React, { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { SplineSceneBasic } from './components/ui/demo';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from './components/ui/card';
import { SpotlightHover } from './components/ui/spotlight-hover';
import { BackgroundPaths } from './components/ui/background-paths';
import { AetherHero } from './components/ui/aether-hero';
import { Accordion05 } from './components/ui/accordion-05';
import { Navbar } from './components/ui/mini-navbar';
import { HoverFooter } from './components/ui/hover-footer';
import { AgentsPage } from './components/ui/agents-page';
import { LeadModal } from './components/ui/lead-modal';
import { AuthModal } from './components/ui/auth-modal';
import { MouseAuras } from './components/ui/mouse-auras';
import { RoiCalculator } from './components/ui/roi-calculator';
import { TestimonialsSection } from './components/ui/testimonials-section';
import { TeamSection } from './components/ui/team-section';
import { supabase } from './lib/supabase';
import { cn } from './lib/utils';
import {
  Brain,
  Code2,
  Database,
  Cpu,
  Plane,
  Map,
  Rocket,
  Globe,
  Terminal,
  CheckCircle2,
  ChevronRight,
  Cloud,
  ArrowUpRight,
  Star,
  Shield,
  GraduationCap,
  Layout
} from 'lucide-react';

const ICON_MAP: any = {
  Brain, Code2, Database, Cpu, Plane, Map, Rocket, Globe, Terminal, Cloud, ArrowUpRight, Star, Shield, GraduationCap, Layout
};

const TECH_STACK = [
  {
    title: "Next-Gen Frontend",
    description: "Architecting high-performance interfaces with Next.js 15, React, and Tailwind CSS. Focused on Core Web Vitals and refined UX.",
    icon: Globe,
    tag: "Interface",
    color: "blue"
  },
  {
    title: "AI Ecosystems",
    description: "Integrating LLMs (OpenAI, Gemini), vector databases (Pinecone), and custom agentic workflows into production software.",
    icon: Brain,
    tag: "Intelligence",
    color: "purple"
  },
  {
    title: "Scalable Backend",
    description: "Robust data architectures using Supabase, PostgreSQL, and Node.js. Secure, real-time, and built to scale globally.",
    icon: Database,
    tag: "Infrastructure",
    color: "emerald"
  },
  {
    title: "Cloud & DevOps",
    description: "Zero-downtime deployments via Vercel and AWS. Automated CI/CD pipelines and edge computing for maximum velocity.",
    icon: Cloud,
    tag: "Deployment",
    color: "amber"
  }
];

const BUSINESS_AGENTS = [
  {
    title: "Email Automation Pro",
    description: "Autonomous inbox management. Triage, draft responses, and follow-up with leads 24/7 using your unique tone of voice.",
    icon: Globe,
    tag: "Communication",
    color: "blue"
  },
  {
    title: "Calendar Architect",
    description: "Next-level scheduling. Resolves complex conflicts, pre-qualifies meetings, and handles rescheduling without human input.",
    icon: Brain,
    tag: "Operations",
    color: "purple"
  },
  {
    title: "Lead Gen Scout",
    description: "Identify and qualify high-intent prospects across the web. Automatically updates your CRM with verified data.",
    icon: Database,
    tag: "Growth",
    color: "emerald"
  },
  {
    title: "24/7 Support Oracle",
    description: "Instant resolution for customer queries. Deep knowledge-base integration to provide accurate answers instantly.",
    icon: Cloud,
    tag: "Support",
    color: "amber"
  }
];

const COURSES = [
  {
    title: "AI Prompting Mastery",
    description: "Master the art of prompt engineering. Learn to control LLMs like Gemini and GPT-4 for complex business logic and automation.",
    duration: "4 Weeks",
    level: "All Levels",
    badge: "Most Popular",
    color: "blue"
  },
  {
    title: "AI-Driven Web Design",
    description: "Build modern, high-conversion websites using AI-first tools. From Figma-to-code to agentic UI generation.",
    duration: "6 Weeks",
    level: "Creative Focus",
    badge: "Trending",
    color: "purple"
  },
  {
    title: "Applied ML & LLMs",
    description: "Deep dive into Machine Learning. Build and deploy fine-tuned models and RAG pipelines for production environments.",
    duration: "12 Weeks",
    level: "Advanced",
    badge: "High Growth",
    color: "emerald"
  },
  {
    title: "Python for AI Ops",
    description: "The essential language of AI. Learn Python for data processing, API integration, and autonomous script writing.",
    duration: "8 Weeks",
    level: "Beginner Friendly",
    badge: "Essential",
    color: "amber"
  },
  {
    title: "AI Data Science",
    description: "Transform raw data into predictive insights. Master big data analysis with AI-augmented tools and statistical models.",
    duration: "10 Weeks",
    level: "Data Focus",
    badge: "Certification",
    color: "blue"
  }
];

const PLANS = [
  {
    name: "Freelancer Kickstart",
    price: "₹4,999",
    description: "Get a polished portfolio, landing page, or micro-SaaS MVP built and deployed fast.",
    features: ["1-Page React Website", "Contact/Lead Form", "Deployed on Vercel", "Basic SEO Setup", "3-day delivery"],
    buttonText: "Start Now",
    highlight: false,
    badge: null,
    accentColor: "blue"
  },
  {
    name: "Startup Launch",
    price: "₹14,999",
    description: "Validate your idea with a fast, functional MVP — built for Indian founders and early-stage teams.",
    features: ["React + Supabase MVP", "Auth & Dashboard", "1 AI Feature", "Mobile Responsive", "1-week delivery"],
    buttonText: "Launch MVP",
    highlight: false,
    badge: "Best for Founders",
    accentColor: "purple"
  },
  {
    name: "E-Commerce AI Store",
    price: "₹29,999",
    description: "Complete D2C store with AI product recommendations, Razorpay/UPI, and inventory dashboard.",
    features: ["Product Catalog + Cart", "Razorpay / UPI Integration", "AI Recommendations Engine", "Admin Inventory Panel", "WhatsApp/SMS Alerts", "2-week delivery"],
    buttonText: "Build My Store",
    highlight: true,
    badge: "Most Popular 🔥",
    accentColor: "emerald"
  },
  {
    name: "Full-Stack SaaS Pro",
    price: "₹49,999",
    description: "Production-ready SaaS with user auth, billing, AI features, and admin panel — ideal for MSMEs.",
    features: ["React + Node.js + Supabase", "User Auth + Roles", "Stripe / Razorpay Billing", "AI Feature Integration", "Framer Motion UI", "Admin Dashboard", "2–3 week delivery"],
    buttonText: "Build SaaS",
    highlight: false,
    badge: null,
    accentColor: "blue"
  },
  {
    name: "AI Agent Forge",
    price: "₹39,999",
    description: "Deploy a custom AI agent for your business — customer support, lead gen, or internal automation.",
    features: ["Custom LLM Integration", "GPT-4 / Gemini Backend", "WhatsApp / Web Chat UI", "Knowledge Base Upload", "Analytics Dashboard", "2-week delivery"],
    buttonText: "Deploy Agent",
    highlight: false,
    badge: "Hot 🤖",
    accentColor: "amber"
  },
  {
    name: "EdTech Platform",
    price: "₹59,999",
    description: "Full learning management system with AI quiz generation, video hosting, and student tracking.",
    features: ["Course Builder + Video Upload", "AI Quiz Generator", "Student Progress Dashboard", "Payment Gateway", "Certificate System", "3-week delivery"],
    buttonText: "Build Platform",
    highlight: false,
    badge: null,
    accentColor: "purple"
  },
  {
    name: "Healthcare AI Suite",
    price: "₹74,999",
    description: "Appointment booking, electronic health records, and AI symptom checker for clinics and hospitals.",
    features: ["Appointment + Queue System", "Patient Health Records", "AI Symptom Checker", "Doctor Portal + Reports", "WhatsApp Reminders", "3-week delivery"],
    buttonText: "Build Clinic App",
    highlight: false,
    badge: null,
    accentColor: "emerald"
  },
  {
    name: "Real Estate AI",
    price: "₹44,999",
    description: "Property listing platform with AI price prediction, lead management, and virtual tour builder.",
    features: ["Property Listing + Search", "AI Price Predictor", "Lead CRM Dashboard", "Virtual Tour Integration", "WhatsApp Lead Notifications", "2-week delivery"],
    buttonText: "Build PropTech",
    highlight: false,
    badge: null,
    accentColor: "blue"
  },
  {
    name: "Enterprise AI Suite",
    price: "Custom",
    description: "Bespoke deep learning pipelines, custom LLM fine-tuning, and cloud-scale deployment for large teams.",
    features: ["Custom Neural Networks", "LLM Fine-tuning (Gemini/GPT)", "Dockerized Deployment", "CI/CD Pipeline", "Dedicated Support + SLA", "Flexible timeline"],
    buttonText: "Contact Us",
    highlight: false,
    badge: "Enterprise",
    accentColor: "amber"
  }
];

const CODING_PROJECTS = [
  {
    id: "uneplore",
    name: "Uneplore Himalayas",
    status: "Live",
    statusColor: "emerald",
    description: "Serverless travel booking platform built with React, TS, and Vite. Architected with Supabase.",
    features: ["Custom CMS for CRUD", "Framer Motion Cinematic UI", "TypeScript Services Abstract", "Optimistic UI Updates"],
    icon: Plane,
    accentColor: "from-blue-500/20 to-blue-500/0",
    link: "https://uneplorehimalays.com/"
  },
  {
    id: "terraroam",
    name: "TerraRoam Holidays",
    status: "Live",
    statusColor: "emerald",
    description: "Modern full-stack travel platform utilizing React, Tailwind CSS, and Appwrite for client acquisition.",
    features: ["Custom Admin Panel", "Dynamic Callback Process", "Polished 3D Animations", "Interactive Modals"],
    icon: Map,
    accentColor: "from-purple-500/20 to-purple-500/0",
    link: "https://www.terraroamholidays.com/"
  },
  {
    id: "custom-ai",
    name: "AI Integrated Systems",
    status: "Internal",
    statusColor: "amber",
    description: "Custom built Python backend systems using FastAPI and Deep Learning integrations.",
    features: ["TensorFlow & Keras Models", "Hugging Face APIs", "Scalable Architecture", "NumPy & Pandas Processing"],
    icon: Code2,
    accentColor: "from-emerald-500/20 to-emerald-500/0",
    link: null
  }
];

const WORKFLOW_STEPS = [
  { step: "01", title: "Audit", desc: "We deep dive into your current technical stack and identify bottlenecks.", color: "purple" },
  { step: "02", title: "Blueprint", desc: "Design a custom AI architecture and coding roadmap.", color: "blue" },
  { step: "03", title: "Forge", desc: "Our elite engineers and AI agents build your solution.", color: "emerald" },
  { step: "04", title: "Ignite", desc: "Seamless deployment with continuous monitoring and updates.", color: "amber" }
];

const STAT_TARGETS = [
  { label: "Agents Deployed", val: 2400, suffix: "+", display: "2.4k+" },
  { label: "Efficiency Boost", val: 85, suffix: "%", display: "85%" },
  { label: "Custom Models", val: 120, suffix: "+", display: "120+" },
  { label: "Global Clients", val: 400, suffix: "+", display: "400+" }
];

const colorMap: Record<string, { icon: string; border: string; glow: string; tag: string }> = {
  purple: { icon: 'text-purple-400', border: 'hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]', glow: 'bg-purple-500/10 border-purple-500/20', tag: 'text-purple-400 border-purple-500/20 bg-purple-500/5' },
  blue:   { icon: 'text-blue-400',   border: 'hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)]',   glow: 'bg-blue-500/10 border-blue-500/20',   tag: 'text-blue-400 border-blue-500/20 bg-blue-500/5'   },
  emerald:{ icon: 'text-emerald-400',border: 'hover:border-emerald-500/30 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]',glow: 'bg-emerald-500/10 border-emerald-500/20',tag:'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'},
  amber:  { icon: 'text-amber-400',  border: 'hover:border-amber-500/30 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)]',  glow: 'bg-amber-500/10 border-amber-500/20',  tag: 'text-amber-400 border-amber-500/20 bg-amber-500/5'  },
};

function AnimatedStat({ target, suffix, display }: { target: number; suffix: string; display: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [isInView, target]);

  const formatted = count >= 1000 ? (count / 1000).toFixed(1) + 'k' : String(count);

  return (
    <div ref={ref} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      {formatted}{suffix}
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'agents'>('home');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [modalSource, setModalSource] = useState("General Inquiry");
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [livePlans, setLivePlans] = useState<any[]>(PLANS);
  const [liveCourses, setLiveCourses] = useState<any[]>(COURSES);
  const [liveAgents, setLiveAgents] = useState<any[]>(BUSINESS_AGENTS);

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          try {
            const { data: profile } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single();
            setIsAdmin(profile?.role === 'admin');
          } catch (e) {
            console.log("No specific profile doc found.");
          }
        }
      } catch (err) {
        console.error('Session check error.');
      }
    };
    checkSession();

    // Fetch packages from Supabase
    const fetchPackages = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          setLivePlans(data.map((pkg: any) => ({
            name: pkg.name,
            price: pkg.price === 0 ? 'Custom' : `\u20B9${Number(pkg.price).toLocaleString('en-IN')}`,
            description: pkg.description,
            features: Array.isArray(pkg.features) ? pkg.features : [],
            buttonText: pkg.price === 0 ? 'Contact Us' : 'Get Started',
            highlight: pkg.highlight,
            badge: pkg.badge || null,
            accentColor: 'blue',
          })));
        }
      } catch {
        // Silently fall back to hardcoded PLANS
      }
    };

    // Fetch courses from Supabase
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          setLiveCourses(data.map((c: any) => ({
            ...c,
            color: c.color || 'blue',
          })));
        }
      } catch {
        // Fallback to hardcoded COURSES
      }
    };

    // Fetch agents from Supabase
    const fetchAgents = async () => {
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          setLiveAgents(data.map((a: any) => ({
            ...a,
            icon: ICON_MAP[a.icon] || Globe,
            color: a.color || 'blue',
          })));
        }
      } catch {
        // Fallback to hardcoded BUSINESS_AGENTS
      }
    };

    fetchPackages();
    fetchCourses();
    fetchAgents();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      console.error('Logout failed');
    }
  };

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const openInquiryModal = (source?: string) => {
    setModalSource(source || "General Inquiry");
    setIsLeadModalOpen(true);
  };

  const scrollToSection = useCallback((id: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const navOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 150);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }, [currentPage]);

  const navigateToPage = (page: 'home' | 'about' | 'agents') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col selection:bg-purple-500/30 relative">
      <MouseAuras />
      <Navbar
        onScrollToSection={scrollToSection}
        onNavigateToPage={navigateToPage}
        onAuthOpen={openAuth}
        onLogout={handleLogout}
        currentPage={currentPage}
        user={user}
        isAdmin={isAdmin}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
        initialMode={authMode}
      />

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        source={modalSource}
      />

      <AnimatePresence mode="wait">
        {currentPage === 'home' ? (
          <motion.main
            key="home-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 w-full relative"
          >
            {/* Hero */}
            <section className="w-full h-screen relative z-10 overflow-hidden">
              <SplineSceneBasic onCtaClick={() => scrollToSection('cta')} />
            </section>

            <div className="px-5 sm:px-10 lg:px-20 max-w-[1920px] mx-auto relative z-20">

              {/* Background Paths / Marquee Section */}
              <section className="my-20 md:my-40 flex items-center justify-center overflow-hidden">
                <BackgroundPaths
                  title="Forge the Future of Labor"
                  onButtonClick={() => scrollToSection('cta')}
                />
              </section>

              {/* What We Build Best — Projects section */}
              <section id="projects" className="mb-40 md:mb-60 relative scroll-mt-32">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
                  <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Featured Work
                    </div>
                    <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9]">What We<br/>Build Best</h2>
                  </div>
                  <p className="text-neutral-500 text-base md:text-xl leading-relaxed max-w-sm">
                    Production-ready full-stack applications and custom AI integrations, live in the wild.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-[minmax(300px,auto)]">
                  {CODING_PROJECTS.map((project, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, duration: 0.5 }}
                      whileHover={{ y: -8 }}
                      className={cn(
                        "group bg-neutral-950/50 backdrop-blur-xl border border-white/[0.06] rounded-[2.5rem] p-8 md:p-12 hover:border-white/10 transition-all duration-500 relative overflow-hidden flex flex-col",
                        i === 0 ? "lg:col-span-2 lg:row-span-1" : "",
                        i === 1 ? "lg:col-span-1 lg:row-span-2" : "",
                        i === 2 ? "lg:col-span-2 lg:row-span-1" : ""
                      )}
                    >
                      <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r", project.accentColor)} />

                      <div className="flex items-start justify-between mb-8">
                        <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center border border-white/[0.06]">
                          <project.icon className="w-7 h-7 text-neutral-300" />
                        </div>
                        <span className={cn(
                          "flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                          project.statusColor === 'emerald'
                            ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                            : 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", project.statusColor === 'emerald' ? 'bg-emerald-400' : 'bg-amber-400')} />
                          {project.status}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{project.name}</h3>
                      <p className="text-neutral-500 text-sm md:text-base mb-8 leading-relaxed flex-grow">{project.description}</p>

                      <ul className="space-y-2.5 mb-10">
                        {project.features.map((f, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm text-neutral-400">
                            <CheckCircle2 className="w-4 h-4 text-neutral-700 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-4 rounded-xl border border-white/[0.08] text-white text-[10px] font-black hover:bg-white hover:text-black transition-all bg-transparent uppercase tracking-[0.35em] flex items-center justify-center gap-2"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          View Live
                        </a>
                      ) : (
                        <button
                          onClick={() => openInquiryModal(`Forge Request: ${project.name}`)}
                          className="w-full py-4 rounded-xl border border-white/[0.08] text-white text-[10px] font-black hover:bg-white hover:text-black transition-all bg-transparent uppercase tracking-[0.35em]"
                        >
                          Get Estimate
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* AI Courses Academy */}
              <section id="courses" className="mb-40 md:mb-60 relative scroll-mt-32">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
                  <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Learning Center
                    </div>
                    <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9]">AI Mastery<br/>Academy</h2>
                  </div>
                  <div className="max-w-sm">
                    <p className="text-neutral-500 text-base md:text-xl leading-relaxed mb-6">
                      Bachelors & Graduates friendly. Professional certification with 100% placement support.
                    </p>
                    <div className="inline-flex items-center gap-3 text-emerald-400 font-bold text-[10px] uppercase tracking-widest bg-emerald-500/5 border border-emerald-500/20 px-4 py-2 rounded-full">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Admission Open • Batch 2026
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {liveCourses.map((course, i) => {
                    const colors = colorMap[course.color];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="group bg-neutral-950/40 backdrop-blur-xl border border-white/[0.06] rounded-[2.5rem] p-8 md:p-10 hover:border-white/10 transition-all duration-500 relative flex flex-col h-full"
                      >
                        <div className="flex justify-between items-start mb-10">
                          <div className={cn("px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest", colors.tag)}>
                            {course.badge}
                          </div>
                          <div className="text-neutral-500 text-[10px] font-bold tracking-tight">
                            {course.duration} • {course.level}
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{course.title}</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed mb-10 flex-grow">{course.description}</p>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
                            <Shield className="w-3.5 h-3.5 text-emerald-500" />
                            Placement Support Included
                          </div>
                          <button 
                            onClick={() => openInquiryModal(`Course Enrollment: ${course.title}`)}
                            className="w-full py-4 rounded-xl bg-white text-black text-[10px] font-black hover:bg-neutral-200 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2"
                          >
                            Enroll with {course.discount > 0 ? `${course.discount}%` : '40%'} Off
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* ROI Calculator */}
              <RoiCalculator />

              {/* Pricing */}
              <section id="plans" className="mb-40 md:mb-60 relative scroll-mt-32">
                <div className="text-center mb-20 md:mb-28">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Pricing
                  </div>
                  <h2 className="text-4xl md:text-8xl font-bold text-white tracking-tighter leading-[0.85]">Service<br/>Packages</h2>
                  <p className="text-neutral-500 max-w-xl mx-auto text-base md:text-lg font-medium mt-6">
                    Transparent pricing for every stage — from first idea to enterprise scale. All prices in INR.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                  {(showAllPlans ? livePlans : livePlans.slice(0, 3)).map((plan, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
                      className={cn(
                        "relative flex flex-col p-8 md:p-12 rounded-[2rem] border transition-all duration-500",
                        plan.highlight
                          ? "bg-neutral-900/50 border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.12)] lg:scale-[1.03] z-10"
                          : "bg-neutral-950/50 border-white/[0.06] hover:border-white/10"
                      )}
                    >
                      {plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-500 text-[9px] font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] whitespace-nowrap">
                          <Star className="w-2.5 h-2.5 fill-white" />
                          {plan.badge}
                        </div>
                      )}

                      {plan.highlight && (
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                      )}

                      <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">{plan.price}</span>
                      </div>
                      <p className="text-neutral-500 text-sm md:text-base mb-8 leading-relaxed">{plan.description}</p>

                      <div className="space-y-3 mb-10 flex-1">
                        {plan.features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 text-sm text-neutral-300">
                            <CheckCircle2 className={cn("w-4 h-4 shrink-0", plan.highlight ? "text-purple-400" : "text-neutral-600")} />
                            {feature}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => openInquiryModal(`${plan.name} Plan Enrollment`)}
                        className={cn(
                          "w-full py-4 rounded-xl font-black transition-all uppercase tracking-[0.3em] text-[10px] active:scale-95",
                          plan.highlight
                            ? "bg-white text-black hover:bg-neutral-100 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            : "bg-neutral-900 text-white hover:bg-neutral-800 border border-white/[0.06]"
                        )}>
                        {plan.buttonText}
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* View More / Show Less toggle */}
                <div className="flex justify-center mt-12">
                  <motion.button
                    onClick={() => setShowAllPlans(prev => !prev)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md text-[10px] font-black uppercase tracking-[0.25em] text-neutral-300 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
                  >
                    <span>{showAllPlans ? 'Show Less' : `View All ${livePlans.length} Plans`}</span>
                    <ChevronRight className={cn('w-4 h-4 transition-transform', showAllPlans ? 'rotate-90' : 'group-hover:translate-x-1')} />
                  </motion.button>
                </div>
              </section>

              {/* Testimonials */}
              <TestimonialsSection />

              {/* Workflow */}
              <section id="workflow" className="mb-40 md:mb-60 scroll-mt-32">
                <div className="text-center mb-20 md:mb-28">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Process
                  </div>
                  <h2 className="text-4xl md:text-8xl font-bold text-white tracking-tighter leading-[0.85]">How We<br/>Operate</h2>
                  <p className="text-neutral-500 max-w-xl mx-auto text-base md:text-lg font-medium mt-6">
                    Precision engineering meets high-velocity deployment.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 relative">
                  {/* Connector line on desktop */}
                  <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent hidden lg:block pointer-events-none" />

                  {WORKFLOW_STEPS.map((step, i) => {
                    const colors = colorMap[step.color];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        whileHover={{ y: -5 }}
                        className="relative p-8 md:p-10 rounded-[2rem] bg-neutral-950/60 border border-white/[0.06] hover:border-white/10 transition-all duration-400 backdrop-blur-sm"
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border mb-8 text-xs font-black", colors.glow, colors.icon)}>
                          {step.step}
                        </div>
                        <h4 className="text-xl md:text-2xl font-bold text-white mb-4">{step.title}</h4>
                        <p className="text-sm md:text-base text-neutral-500 leading-relaxed">{step.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* CTA */}
              <section id="cta" className="mb-40 md:mb-60 relative rounded-[2.5rem] overflow-hidden border border-white/[0.08] scroll-mt-32">
                <AetherHero
                  height="600px"
                  title="Forge the Future of Labor."
                  subtitle="Our engineers are ready to architect your custom AI ecosystem. Book a technical audit today and secure your competitive edge in the automated era."
                  ctaLabel="Initiate Audit"
                  onCtaClick={() => openInquiryModal("Technical Audit Protocol")}
                  align="center"
                  overlayGradient="linear-gradient(180deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.7) 40%, transparent)"
                />
              </section>
            </div>
          </motion.main>
        ) : currentPage === 'about' ? (
          <motion.div
            key="about-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative min-h-screen pt-28 z-20 pb-40"
          >
            <div className="relative z-10 px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
              
              {/* About Hero / Mission */}
              <section className="pt-20 pb-32">
                <div className="max-w-4xl">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      About The Agency
                    </div>
                    <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-[0.85] mb-12">
                      Engineering<br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Unfair Advantages.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-400 font-medium leading-relaxed max-w-2xl">
                      We don't just build software. We architect autonomous intelligence and high-velocity systems for the next generation of industry leaders.
                    </p>
                  </motion.div>
                </div>
              </section>

              {/* Up-To-Date Tech Stack */}
              <section className="py-24 border-t border-white/[0.06]">
                <div className="mb-16 md:mb-24 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Our Arsenal
                  </div>
                  <h2 className="text-4xl md:text-8xl font-bold text-white tracking-tighter leading-[0.85]">Up-To-Date<br/>Tech Stack</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-32">
                  {TECH_STACK.map((item: any, i: number) => {
                    const colors = colorMap[item.color];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      >
                        <Card className={cn(
                          "group overflow-hidden bg-neutral-950/40 backdrop-blur-xl border-white/[0.06] transition-all duration-500 relative rounded-[2.5rem] h-full p-8 md:p-12 hover:border-white/10",
                          colors.border
                        )}>
                          <SpotlightHover />
                          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-10 border transition-all duration-500", colors.glow)}>
                            <item.icon className={cn("w-8 h-8", colors.icon)} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{item.title}</h3>
                              <span className={cn("text-[9px] px-3 py-1 rounded-full border font-bold uppercase tracking-widest", colors.tag)}>{item.tag}</span>
                            </div>
                            <p className="text-neutral-500 text-lg leading-relaxed">{item.description}</p>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* Philosophy Section */}
              <section className="py-24 border-t border-white/[0.06]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-20">
                  <div className="lg:col-span-1">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-8">Our Execution Philosophy</h2>
                    <p className="text-neutral-500 text-lg leading-relaxed">
                      We believe in pushing the boundaries of what's possible at the intersection of human creativity and artificial intelligence.
                    </p>
                  </div>
                  <div className="lg:col-span-2 space-y-16">
                    {[
                      {
                        title: "Performance First",
                        desc: "Every millisecond counts. We optimize for high-concurrency and sub-second latency across the entire stack."
                      },
                      {
                        title: "AI-Native Thinking",
                        desc: "AI isn't a feature; it's a foundation. We architect systems that learn, adapt, and evolve in real-time."
                      },
                      {
                        title: "Immutable Scalability",
                        desc: "We build for tomorrow. Our systems are horizontally scalable, containerized, and cloud-agnostic by default."
                      }
                    ].map((pillar: any, i: number) => (
                      <div key={i} className="group relative">
                        <div className="absolute -left-8 top-0 text-7xl font-black text-white/5 group-hover:text-white/10 transition-colors hidden md:block select-none">
                          0{i + 1}
                        </div>
                        <h4 className="text-xl md:text-2xl font-bold text-white mb-4">{pillar.title}</h4>
                        <p className="text-lg text-neutral-500 leading-relaxed max-w-xl">{pillar.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <TeamSection />
              <Accordion05 />
            </div>
          </motion.div>
        ) : currentPage === 'agents' ? (
          <motion.main
            key="agents-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 w-full relative"
          >
            <AgentsPage onOpenInquiry={openInquiryModal} />
          </motion.main>
        ) : null}
      </AnimatePresence>

      <HoverFooter
        onNavigate={navigateToPage}
        onScroll={scrollToSection}
        onContact={() => openInquiryModal("General Foundry Contact")}
      />
    </div>
  );
}