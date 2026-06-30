import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Github, Mail, Shield, Brain, Terminal, Cpu } from 'lucide-react';
import { cn } from '../../lib/utils';
import agentsData from '../data/agents.json';
import divisionsData from '../data/divisions.json';

// Group agents by division and pick top 4 for each to keep the UI clean
const getGroupedAgents = () => {
  const groups: Record<string, any[]> = {};
  
  agentsData.forEach(agent => {
    if (!groups[agent.division]) {
      groups[agent.division] = [];
    }
    if (groups[agent.division].length < 4) { // limit to 4 per division
      groups[agent.division].push(agent);
    }
  });

  return groups;
};

export function TeamSection() {
  const groupedAgents = useMemo(() => getGroupedAgents(), []);
  const divisions = divisionsData.divisions as Record<string, any>;

  return (
    <section className="py-24 md:py-32 relative border-t border-white/[0.06]">
      <div className="max-w-[1920px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10">
        
        {/* Section Header */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            The Architects
          </div>
          <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9] max-w-2xl">
            Human Ingenuity meets <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Autonomous Execution.</span>
          </h2>
        </div>

        {/* Owner Profile */}
        <div className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] bg-neutral-950/60 border border-white/[0.08] p-10 md:p-16 lg:p-20 group"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent opacity-50 mix-blend-screen pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-12">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-neutral-900 bg-neutral-800 overflow-hidden shrink-0 shadow-2xl relative">
                {/* Fallback avatar if no image */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-7xl font-black text-white">
                  DY
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-4">
                  Owner / Founder
                </div>
                <h3 className="text-4xl md:text-6xl font-bold text-white mb-6">Dev Yadav</h3>
                <p className="text-lg md:text-xl text-neutral-400 leading-relaxed mb-8 max-w-2xl">
                  Pioneering the transition from human labor to autonomous intelligence. Devscosmic A.I was forged with a singular mission: to construct the ultimate digital workforce and hand the keys to modern businesses.
                </p>
                
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
                    <Github className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Agents Team Grid */}
        <div className="space-y-24">
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">The Digital Workforce</h3>
            <p className="text-neutral-500 max-w-2xl">
              Over 200+ specialized AI agents operating across multiple divisions, architected by Dev Yadav to execute tasks with zero latency and absolute precision.
            </p>
          </div>

          {Object.entries(groupedAgents).map(([divisionId, agents], idx) => {
            const divData = divisions[divisionId];
            if (!divData) return null;
            
            return (
              <motion.div 
                key={divisionId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-white/[0.05]" />
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-white/[0.05]">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-widest">{divData.label} Division</span>
                  </div>
                  <div className="h-px flex-1 bg-white/[0.05]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {agents.map((agent: any, i: number) => (
                    <div key={i} className="p-6 rounded-2xl bg-neutral-950/40 border border-white/[0.06] hover:border-white/20 transition-colors group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                          <Cpu className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500 bg-black px-2 py-1 rounded">Active</span>
                      </div>
                      <h4 className="text-white font-bold mb-2 group-hover:text-purple-400 transition-colors">{agent.name}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-3">{agent.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
