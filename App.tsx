import React, { useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplineSceneBasic } from './components/ui/demo';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card';
import { SpotlightHover } from './components/ui/spotlight-hover';
import { BackgroundPaths } from './components/ui/background-paths';
import { AetherHero } from './components/ui/aether-hero';
import { Accordion05 } from './components/ui/accordion-05';
import { Navbar } from './components/ui/mini-navbar';
import { HoverFooter } from './components/ui/hover-footer';
import { LeadModal } from './components/ui/lead-modal';
import { AuthModal } from './components/ui/auth-modal';
import { account, databases, DATABASE_ID, COLLECTION_ID_PROFILES } from './lib/appwrite';
import { cn } from './lib/utils';
import { 
  ShieldCheck, 
  Code2, 
  MessageSquare, 
  Cpu, 
  Rocket, 
  Globe, 
  Terminal, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

const AGENTS = [
  {
    title: "Ops Sentinel",
    description: "Automated infrastructure management and real-time monitoring agent.",
    icon: ShieldCheck,
    tag: "Autonomous"
  },
  {
    title: "Code Catalyst",
    description: "AI-driven pair programmer that writes production-ready features in seconds.",
    icon: Code2,
    tag: "Creative"
  },
  {
    title: "Support Sage",
    description: "Advanced NLP agent capable of handling complex multi-step user inquiries.",
    icon: MessageSquare,
    tag: "Interactive"
  },
  {
    title: "Data Dynamo",
    description: "Large-scale data processing and predictive analytics engine.",
    icon: Cpu,
    tag: "Analytic"
  }
];

const PLANS = [
  {
    name: "Starter",
    price: "₹7,999",
    description: "Perfect for testing AI concepts and small automations.",
    features: ["1 Autonomous Agent", "Basic LLM Access", "Community Support", "Standard API Quota"],
    buttonText: "Join Starter",
    highlight: false
  },
  {
    name: "Growth",
    price: "₹39,999",
    description: "Scale your workflow with multi-agent orchestration.",
    features: ["5 Custom Agents", "Custom Tooling", "Priority Engineering", "Enhanced Security", "White-glove Onboarding"],
    buttonText: "Go Pro",
    highlight: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Fully bespoke AI ecosystems for large-scale production.",
    features: ["Unlimited Agents", "On-premise Deployment", "Dedicated AI Architect", "SLA Guarantees", "Custom Model Fine-tuning"],
    buttonText: "Contact Us",
    highlight: false
  }
];

const CODING_PROJECTS = [
  {
    id: "mvp",
    name: "MVP Launchpad",
    price: "₹1,49,999",
    description: "Go from idea to functional prototype in 3 weeks.",
    features: ["Full Stack Web/Mobile", "Any Language (Py, JS, Go, Rust)", "Basic Cloud Setup", "Source Code Access"],
    icon: Rocket
  },
  {
    id: "saas",
    name: "SaaS Scale-Up",
    price: "₹4,99,999",
    description: "Production-ready platforms built for massive scale.",
    features: ["Microservices Arch", "Advanced Security", "CI/CD Pipelines", "1 Month Support", "Multi-Language Support"],
    icon: Globe
  },
  {
    id: "legacy",
    name: "Legacy Modernizer",
    price: "₹9,99,999+",
    description: "Refactor complex legacy systems into modern stacks.",
    features: ["Full Audit & Roadmap", "Incremental Migration", "Rust/C++/Go Performance", "Enterprise Scalability"],
    icon: Terminal
  }
];

const WORKFLOW_STEPS = [
  { step: "01", title: "Audit", desc: "We deep dive into your current technical stack and identify bottlenecks." },
  { step: "02", title: "Blueprint", desc: "Design a custom AI architecture and coding roadmap." },
  { step: "03", title: "Forge", desc: "Our elite engineers and AI agents build your solution." },
  { step: "04", title: "Ignite", desc: "Seamless deployment with continuous monitoring and updates." }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [modalSource, setModalSource] = useState("General Inquiry");
  
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        
        // Optionally fetch profile details for admin check
        try {
          const profile = await databases.getDocument(DATABASE_ID, COLLECTION_ID_PROFILES, currentUser.$id);
          setIsAdmin(profile.role === 'admin');
        } catch (e) {
          console.log("No specific profile doc found for role check.");
        }
      } catch (err) {
        console.log('No active session.');
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
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
      }, 100);
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

  const navigateToPage = (page: 'home' | 'about') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col selection:bg-purple-500/30 overflow-x-hidden">
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
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 w-full"
          >
            <section className="w-full h-screen">
              <SplineSceneBasic onCtaClick={() => scrollToSection('cta')} />
            </section>

            <div className="px-5 sm:px-10 lg:px-20 max-w-[1920px] mx-auto">
              <section className="my-20 md:my-40 flex items-center justify-center">
                <BackgroundPaths 
                  title="Dev AI Agency Architecting Intelligence" 
                  onButtonClick={() => scrollToSection('cta')}
                />
              </section>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-40 md:mb-60">
                {[
                  { label: "Agents Deployed", val: "2.4k+" },
                  { label: "Efficiency Boost", val: "85%" },
                  { label: "Custom Models", val: "120+" },
                  { label: "Global Clients", val: "400+" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="group p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-neutral-950 border border-white/5 flex flex-col items-center justify-center text-center transition-all hover:border-white/10"
                  >
                    <div className="text-3xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 mb-2 md:mb-4 font-['Space_Grotesk']">{stat.val}</div>
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 group-hover:text-purple-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <section id="agents" className="mb-40 md:mb-60 relative scroll-mt-32">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
                  <div className="max-w-4xl">
                    <h2 className="text-4xl md:text-8xl font-bold mb-8 text-white tracking-tighter font-['Space_Grotesk'] leading-[0.9]">Autonomous Agents</h2>
                    <p className="text-neutral-400 text-lg md:text-3xl leading-relaxed font-medium">
                      Built on elite neural architectures, our agents handle cross-stack orchestration, predictive scaling, and intelligent engagement.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {AGENTS.map((agent, i) => (
                    <Card key={i} className="group overflow-hidden bg-neutral-950/40 backdrop-blur-xl border-white/5 transition-all duration-500 hover:border-purple-500/20 relative rounded-[2.5rem]">
                      <SpotlightHover />
                      <CardHeader className="p-8 md:p-10">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mb-8 group-hover:bg-purple-500/10 transition-colors">
                          <agent.icon className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-purple-400 transition-colors" />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <CardTitle className="text-2xl md:text-3xl text-white font-['Space_Grotesk']">{agent.title}</CardTitle>
                          <span className="text-[8px] px-3 py-1 rounded-full border border-neutral-800 text-neutral-500 font-black uppercase tracking-widest">{agent.tag}</span>
                        </div>
                        <CardDescription className="pt-2 leading-relaxed text-neutral-400 text-base md:text-lg">
                          {agent.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="p-8 md:p-10 pt-0">
                        <button 
                          onClick={() => openInquiryModal(`Agent Intake: ${agent.title}`)}
                          className="flex items-center gap-3 text-[10px] md:text-xs font-black text-neutral-500 group-hover:text-white transition-all uppercase tracking-[0.3em]"
                        >
                          Initialize <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                        </button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </section>

              <section id="projects" className="mb-40 md:mb-60 relative scroll-mt-32">
                <div className="text-center mb-24 md:mb-32 px-4">
                  <h2 className="text-4xl md:text-9xl font-bold mb-8 text-white tracking-tighter font-['Space_Grotesk'] leading-[0.85]">Project Forge</h2>
                  <p className="text-neutral-400 max-w-4xl mx-auto text-lg md:text-3xl font-medium leading-relaxed">
                    Engineering production-ready systems with high performance and infinite scalability.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                  {CODING_PROJECTS.map((project, i) => (
                    <div key={i} className="group bg-neutral-950/40 backdrop-blur-xl border border-white/5 rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 hover:border-blue-500/20 transition-all duration-500 relative overflow-hidden flex flex-col h-full">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-neutral-900 rounded-2xl flex items-center justify-center mb-8 border border-white/5">
                        <project.icon className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white font-['Space_Grotesk']">{project.name}</h3>
                      <div className="text-4xl md:text-5xl font-bold text-white mb-8">{project.price}</div>
                      <p className="text-neutral-400 text-base md:text-lg mb-10 leading-relaxed font-medium">{project.description}</p>
                      <ul className="space-y-4 mb-12 flex-1">
                        {project.features.map((f, idx) => (
                          <li key={idx} className="flex items-center gap-4 text-sm md:text-base text-neutral-300">
                            <CheckCircle2 className="w-5 h-5 text-blue-500/50 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => openInquiryModal(`Forge Request: ${project.name}`)}
                        className="w-full py-6 rounded-2xl border border-white/10 text-white font-black hover:bg-white hover:text-black transition-all bg-neutral-900/50 uppercase tracking-[0.4em] text-[10px]"
                      >
                        Get Estimate
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section id="plans" className="mb-40 md:mb-60 py-20 md:py-32 bg-neutral-950/20 backdrop-blur-xl rounded-[3rem] md:rounded-[5rem] border border-white/5 relative overflow-hidden scroll-mt-32">
                <div className="px-8 md:px-16">
                  <div className="text-center mb-20 md:mb-32">
                    <h2 className="text-4xl md:text-9xl font-bold mb-8 text-white tracking-tighter font-['Space_Grotesk'] leading-[0.85]">Scalable Plans</h2>
                    <p className="text-neutral-400 max-w-3xl mx-auto text-lg md:text-2xl font-medium">
                      Choose the level of intelligence and velocity your organization demands.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {PLANS.map((plan, i) => (
                      <div key={i} className={cn(
                        "relative flex flex-col p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border transition-all duration-500",
                        plan.highlight 
                          ? "bg-neutral-900/30 border-purple-500/20 scale-[1.02] z-10" 
                          : "bg-black/20 border-white/5"
                      )}>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white font-['Space_Grotesk']">{plan.name}</h3>
                        <div className="flex items-baseline gap-2 mb-8">
                          <span className="text-4xl md:text-6xl font-bold text-white tracking-tighter">{plan.price}</span>
                        </div>
                        <p className="text-neutral-400 text-base md:text-lg mb-10 leading-relaxed">
                          {plan.description}
                        </p>
                        <div className="space-y-4 mb-12 flex-1">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-4 text-sm md:text-base text-neutral-300 font-medium">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => openInquiryModal(`${plan.name} Plan Enrollment`)}
                          className={cn(
                          "w-full py-6 rounded-2xl font-black transition-all uppercase tracking-[0.4em] text-[10px]",
                          plan.highlight 
                            ? "bg-white text-black hover:bg-neutral-200" 
                            : "bg-neutral-900 text-white hover:bg-neutral-800 border border-white/5"
                        )}>
                          {plan.buttonText}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="workflow" className="mb-40 md:mb-60 scroll-mt-32">
                <div className="text-center mb-24 md:mb-32">
                  <h2 className="text-4xl md:text-9xl font-bold mb-8 text-white tracking-tighter font-['Space_Grotesk'] leading-[0.85]">The Foundry</h2>
                  <p className="text-neutral-400 max-w-4xl mx-auto text-lg md:text-2xl font-medium leading-relaxed">
                    Precision engineering meets high-velocity deployment.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                  {WORKFLOW_STEPS.map((step, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -5 }}
                      className="relative p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] bg-neutral-950 border border-white/5"
                    >
                      <div className="text-8xl md:text-[10rem] font-black text-white/[0.02] absolute top-4 right-10 pointer-events-none select-none font-['Space_Grotesk']">{step.step}</div>
                      <h4 className="text-2xl md:text-3xl font-bold mb-6 text-white font-['Space_Grotesk'] relative z-10">{step.title}</h4>
                      <p className="text-base md:text-lg text-neutral-500 leading-relaxed font-semibold relative z-10">{step.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section id="cta" className="mb-40 md:mb-60 relative rounded-[3rem] md:rounded-[5rem] overflow-hidden border border-white/10 shadow-2xl scroll-mt-32">
                <AetherHero
                  height="700px"
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
        ) : (
          <motion.div 
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative min-h-screen pt-40"
          >
            <div className="relative z-10 px-6 py-20">
               <Accordion05 />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HoverFooter 
        onNavigate={navigateToPage} 
        onScroll={scrollToSection} 
        onContact={() => openInquiryModal("General Foundry Contact")}
      />
    </div>
  );
}