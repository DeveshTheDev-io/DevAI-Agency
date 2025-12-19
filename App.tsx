
import React, { useCallback, useState } from 'react';
import { SplineSceneBasic } from './components/ui/demo';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card';
import { SpotlightHover } from './components/ui/spotlight-hover';
import { FloatingPaths, BackgroundPaths } from './components/ui/background-paths';
import { AetherHero } from './components/ui/aether-hero';
import { Accordion05 } from './components/ui/accordion-05';
import { Navbar } from './components/ui/mini-navbar';
import { HoverFooter } from './components/ui/hover-footer';
import { cn } from './lib/utils';
import { 
  Bot, 
  Cpu, 
  Code2, 
  Zap, 
  ShieldCheck, 
  MessageSquare, 
  Layers, 
  Rocket,
  CheckCircle2,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Terminal,
  Globe,
  Smartphone,
  Server
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

  const scrollToSection = useCallback((id: string) => {
    // If we're not on home, go home first then scroll
    if (currentPage !== 'home') {
      setCurrentPage('home');
      // Wait for re-render before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const navOffset = 120; // Increased offset for floating navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const navOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [currentPage]);

  const navigateToPage = (page: 'home' | 'about') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-purple-500/30 overflow-x-hidden">
      {/* Mini Floating Navigation */}
      <Navbar 
        onScrollToSection={scrollToSection} 
        onNavigateToPage={navigateToPage} 
        currentPage={currentPage}
      />

      {/* Main Content */}
      <main className="flex-1 pt-24 w-full">
        {currentPage === 'home' ? (
          <>
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20 pt-10">
              <section className="mb-20">
                <SplineSceneBasic onCtaClick={() => scrollToSection('cta')} />
              </section>

              {/* Intro Background Paths Section */}
              <section className="mb-20">
                <BackgroundPaths 
                  title="Innovation At Scale" 
                  onButtonClick={() => scrollToSection('cta')}
                />
              </section>
            </div>

            {/* Content with Background Paths */}
            <div className="relative w-full">
              <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
                 <FloatingPaths position={1} />
                 <FloatingPaths position={-1} />
              </div>

              <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32">
                  {[
                    { label: "Agents Deployed", val: "2.4k+" },
                    { label: "Efficiency Boost", val: "85%" },
                    { label: "Custom Models", val: "120+" },
                    { label: "Global Clients", val: "400+" }
                  ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-neutral-950/80 backdrop-blur-sm border border-neutral-900 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500 mb-1">{stat.val}</div>
                      <div className="text-xs uppercase tracking-widest text-neutral-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Agents Section */}
                <section id="agents" className="mb-32 relative scroll-mt-32">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Autonomous Agents</h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
                      Our specialized agents are built on top of state-of-the-art LLMs, fine-tuned for production reliability and specific business tasks.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {AGENTS.map((agent, i) => (
                      <Card key={i} className="group overflow-hidden bg-neutral-950/50 backdrop-blur-sm border-neutral-900 transition-all duration-300 hover:border-neutral-700 hover:translate-y-[-4px] relative">
                        <SpotlightHover />
                        <CardHeader>
                          <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center mb-4 group-hover:bg-neutral-800 transition-colors">
                            <agent.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl text-white">{agent.title}</CardTitle>
                            <span className="text-[10px] px-2 py-0.5 rounded-full border border-neutral-800 text-neutral-500">{agent.tag}</span>
                          </div>
                          <CardDescription className="pt-2 leading-relaxed">
                            {agent.description}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0">
                          <button className="flex items-center gap-1 text-sm text-neutral-400 group-hover:text-white transition-colors">
                            Deploy Agent <ChevronRight className="w-4 h-4" />
                          </button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="mb-32 relative scroll-mt-32">
                  <div className="text-center mb-16">
                    <div className="inline-block px-3 py-1 rounded-full border border-blue-500/20 text-[10px] font-bold text-blue-400 mb-6 uppercase tracking-widest bg-blue-500/5">
                      Every Language. Every Framework.
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Full-Stack Project Forge</h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
                      Python, Rust, Swift, TypeScript, or C++. We build high-performance custom software tailored to your specific infrastructure needs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {CODING_PROJECTS.map((project, i) => (
                      <div key={i} className="group bg-neutral-950/80 backdrop-blur-sm border border-neutral-900 rounded-3xl p-8 hover:border-neutral-700 transition-all relative overflow-hidden flex flex-col h-full">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                           <project.icon className="w-48 h-48" />
                        </div>
                        <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 border border-neutral-800">
                          <project.icon className="w-7 h-7 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-white">{project.name}</h3>
                        <div className="text-3xl font-bold text-white mb-4">{project.price}</div>
                        <p className="text-neutral-500 text-sm mb-8 leading-relaxed">{project.description}</p>
                        <ul className="space-y-4 mb-10 flex-1">
                          {project.features.map((f, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-neutral-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <button className="w-full py-4 rounded-xl border border-neutral-800 text-white font-bold hover:bg-neutral-900 transition-colors bg-black/40">
                          Get Estimate
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Plans Section */}
                <section id="plans" className="mb-32 py-16 bg-neutral-950/30 backdrop-blur-sm rounded-3xl border border-neutral-900/50 relative overflow-hidden scroll-mt-32">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full" />
                  <div className="px-8">
                    <div className="text-center mb-16">
                      <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Scalable Plans</h2>
                      <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
                        Choose the level of intelligence and support your organization requires. Prices are in INR.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {PLANS.map((plan, i) => (
                        <div key={i} className={cn(
                          "relative flex flex-col p-8 rounded-3xl border transition-all duration-300",
                          plan.highlight 
                            ? "bg-neutral-900/90 border-neutral-700 shadow-2xl scale-105 z-10" 
                            : "bg-black/90 border-neutral-900 hover:border-neutral-800"
                        )}>
                          {plan.highlight && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                              Most Popular
                            </div>
                          )}
                          <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                          <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-4xl font-bold text-white">{plan.price}</span>
                            {plan.price !== "Custom" && <span className="text-neutral-500 text-sm">/mo</span>}
                          </div>
                          <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                            {plan.description}
                          </p>
                          <div className="space-y-4 mb-10 flex-1">
                            {plan.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm text-neutral-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                {feature}
                              </div>
                            ))}
                          </div>
                          <button className={cn(
                            "w-full py-4 rounded-xl font-bold transition-all",
                            plan.highlight 
                              ? "bg-white text-black hover:bg-neutral-200" 
                              : "bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-800"
                          )}>
                            {plan.buttonText}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Workflow Section */}
                <section id="workflow" className="mb-32 scroll-mt-32">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Our Workflow</h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
                      We operate with high velocity and precision. Here is how we take your project from inception to deployment.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {WORKFLOW_STEPS.map((step, i) => (
                      <div key={i} className="relative p-8 rounded-3xl bg-neutral-950/80 backdrop-blur-sm border border-neutral-900">
                        <div className="text-5xl font-black text-white/5 absolute top-4 right-4">{step.step}</div>
                        <h4 className="text-xl font-bold mb-4 text-white">{step.title}</h4>
                        <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* CTA Section */}
                <section id="cta" className="mb-32 relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl scroll-mt-32">
                  <AetherHero
                    height="600px"
                    title="Ready to integrate true intelligence?"
                    subtitle="Our engineers are ready to build your custom AI roadmap. Book a strategy session today and transform your organization's digital labor force."
                    ctaLabel="Book A Free Audit"
                    ctaHref="#"
                    secondaryCtaLabel="Explore Documentation"
                    secondaryCtaHref="#"
                    align="center"
                    overlayGradient="linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent)"
                  />
                </section>
              </div>
            </div>
          </>
        ) : (
          /* About Me Page View */
          <div className="relative min-h-screen pt-20">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
               <FloatingPaths position={1} />
               <FloatingPaths position={-1} />
            </div>
            <div className="relative z-10 px-4 py-20">
               <Accordion05 />
            </div>
          </div>
        )}
      </main>

      {/* Modern Interactive Footer */}
      <HoverFooter onNavigate={navigateToPage} onScroll={scrollToSection} />
    </div>
  );
}
