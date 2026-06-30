import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SpotlightHover } from './spotlight-hover';
import { BackgroundPaths } from './background-paths';
import { cn } from '../../lib/utils';
import agentsData from '../data/agents.json';
import divisionsData from '../../tmp_agency_agents/divisions.json';

// Import all possible icons from lucide-react (or a subset we need)
import * as LucideIcons from 'lucide-react';

const colorClasses: Record<string, { icon: string; border: string; glow: string; tag: string }> = {
  '#8B5CF6': { icon: 'text-purple-400', border: 'hover:border-purple-500/30', glow: 'bg-purple-500/10 border-purple-500/20', tag: 'text-purple-400 border-purple-500/20 bg-purple-500/5' },
  '#EC4899': { icon: 'text-pink-400', border: 'hover:border-pink-500/30', glow: 'bg-pink-500/10 border-pink-500/20', tag: 'text-pink-400 border-pink-500/20 bg-pink-500/5' },
  '#3B82F6': { icon: 'text-blue-400', border: 'hover:border-blue-500/30', glow: 'bg-blue-500/10 border-blue-500/20', tag: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
  '#22C55E': { icon: 'text-green-400', border: 'hover:border-green-500/30', glow: 'bg-green-500/10 border-green-500/20', tag: 'text-green-400 border-green-500/20 bg-green-500/5' },
  '#A855F7': { icon: 'text-purple-500', border: 'hover:border-purple-500/30', glow: 'bg-purple-500/10 border-purple-500/20', tag: 'text-purple-500 border-purple-500/20 bg-purple-500/5' },
  '#14B8A6': { icon: 'text-teal-400', border: 'hover:border-teal-500/30', glow: 'bg-teal-500/10 border-teal-500/20', tag: 'text-teal-400 border-teal-500/20 bg-teal-500/5' },
  '#F97316': { icon: 'text-orange-400', border: 'hover:border-orange-500/30', glow: 'bg-orange-500/10 border-orange-500/20', tag: 'text-orange-400 border-orange-500/20 bg-orange-500/5' },
  '#EAB308': { icon: 'text-yellow-400', border: 'hover:border-yellow-500/30', glow: 'bg-yellow-500/10 border-yellow-500/20', tag: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5' },
  '#D946EF': { icon: 'text-fuchsia-400', border: 'hover:border-fuchsia-500/30', glow: 'bg-fuchsia-500/10 border-fuchsia-500/20', tag: 'text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/5' },
  '#0EA5E9': { icon: 'text-sky-400', border: 'hover:border-sky-500/30', glow: 'bg-sky-500/10 border-sky-500/20', tag: 'text-sky-400 border-sky-500/20 bg-sky-500/5' },
  '#10B981': { icon: 'text-emerald-400', border: 'hover:border-emerald-500/30', glow: 'bg-emerald-500/10 border-emerald-500/20', tag: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
  '#EF4444': { icon: 'text-red-400', border: 'hover:border-red-500/30', glow: 'bg-red-500/10 border-red-500/20', tag: 'text-red-400 border-red-500/20 bg-red-500/5' },
  '#06B6D4': { icon: 'text-cyan-400', border: 'hover:border-cyan-500/30', glow: 'bg-cyan-500/10 border-cyan-500/20', tag: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' },
  '#6366F1': { icon: 'text-indigo-400', border: 'hover:border-indigo-500/30', glow: 'bg-indigo-500/10 border-indigo-500/20', tag: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5' },
  '#84CC16': { icon: 'text-lime-400', border: 'hover:border-lime-500/30', glow: 'bg-lime-500/10 border-lime-500/20', tag: 'text-lime-400 border-lime-500/20 bg-lime-500/5' },
  '#F59E0B': { icon: 'text-amber-400', border: 'hover:border-amber-500/30', glow: 'bg-amber-500/10 border-amber-500/20', tag: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
  // fallback
  'default': { icon: 'text-blue-400', border: 'hover:border-blue-500/30', glow: 'bg-blue-500/10 border-blue-500/20', tag: 'text-blue-400 border-blue-500/20 bg-blue-500/5' }
};

export function AgentsPage({ onOpenInquiry }: { onOpenInquiry: (source: string) => void }) {
  const [search, setSearch] = useState("");
  const [activeDivision, setActiveDivision] = useState<string | null>(null);

  const divisions = divisionsData.divisions as Record<string, any>;
  
  // Calculate unique divisions available in the agents data
  const availableDivisions = useMemo(() => {
    const divs = new Set(agentsData.map(a => a.division));
    return Array.from(divs).sort();
  }, []);

  const filteredAgents = useMemo(() => {
    return agentsData.filter((agent) => {
      const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) || 
                            agent.description.toLowerCase().includes(search.toLowerCase());
      const matchesDivision = activeDivision ? agent.division === activeDivision : true;
      return matchesSearch && matchesDivision;
    });
  }, [search, activeDivision]);

  return (
    <div className="w-full relative z-20 pb-40">
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-5 sm:px-10 lg:px-20 max-w-[1920px] mx-auto overflow-hidden">
        <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-[9px] font-black uppercase tracking-[0.3em] text-purple-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            The Engine Room
          </div>
          <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9] mb-8">
            Our Autonomous <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">Workforce</span>
          </h1>
          <p className="text-neutral-400 text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto mb-12">
            Devscosmic A.I is powered by an elite ecosystem of over 200 specialized agents. 
            From deep-tech engineering to full-stack marketing, meet the digital minds that build the future.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-5 sm:px-10 lg:px-20 max-w-[1920px] mx-auto mb-16 relative z-30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="relative w-full md:w-96">
            <LucideIcons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text"
              placeholder="Search by role or capability..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900/50 border border-white/10 rounded-full pl-12 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveDivision(null)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold transition-all border",
                activeDivision === null 
                  ? "bg-white text-black border-white" 
                  : "bg-neutral-900/50 text-neutral-400 border-white/10 hover:border-white/30"
              )}
            >
              All Divisions
            </button>
            {availableDivisions.map((div) => {
              const d = divisions[div];
              if (!d) return null;
              return (
                <button
                  key={div}
                  onClick={() => setActiveDivision(div)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-semibold transition-all border",
                    activeDivision === div 
                      ? "bg-white text-black border-white" 
                      : "bg-neutral-900/50 text-neutral-400 border-white/10 hover:border-white/30"
                  )}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent, i) => {
            const divData = divisions[agent.division];
            const colorConfig = divData ? colorClasses[divData.color] || colorClasses['default'] : colorClasses['default'];
            const IconComponent = divData && LucideIcons[divData.icon as keyof typeof LucideIcons] 
              ? (LucideIcons[divData.icon as keyof typeof LucideIcons] as any)
              : LucideIcons.Globe;
            
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className={cn("group bg-neutral-950/40 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 hover:border-white/20 transition-all duration-300 relative overflow-hidden flex flex-col h-full", colorConfig.border)}
              >
                <SpotlightHover />
                <div className="flex items-center gap-4 mb-4 z-10 relative">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", colorConfig.glow)}>
                    <IconComponent className={cn("w-5 h-5", colorConfig.icon)} />
                  </div>
                  <div className="flex-1">
                    <span className={cn("text-[8px] font-black uppercase tracking-widest block mb-1", colorConfig.icon)}>
                      {divData ? divData.label : agent.division}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white tracking-tight mb-2 z-10 relative leading-tight">
                  {agent.name}
                </h3>
                
                <p className="text-neutral-400 text-xs leading-relaxed mb-6 flex-grow z-10 relative">
                  {agent.description}
                </p>
                
                <button 
                  onClick={() => onOpenInquiry(`Hire Agent: ${agent.name}`)}
                  className="w-full py-2.5 rounded-lg border border-white/[0.08] text-white text-[10px] font-bold hover:bg-white hover:text-black transition-all bg-neutral-900/50 uppercase tracking-widest z-10 relative mt-auto"
                >
                  Deploy Profile
                </button>
              </motion.div>
            );
          })}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            No agents found matching your criteria.
          </div>
        )}
      </section>
    </div>
  );
}
