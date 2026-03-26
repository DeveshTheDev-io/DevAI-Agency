'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Loader2, Sparkles, Building2, User, Mail, MessageCircle, BarChart3, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export function LeadModal({ isOpen, onClose, source = "General Inquiry" }: LeadModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const isAudit = source.toLowerCase().includes('audit');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (isAudit) {
        setFormData(prev => ({
          ...prev,
          message: "We are requesting a comprehensive Technical Audit. Our goal is to evaluate infrastructure scalability and identify high-impact AI integration points."
        }));
      } else if (source !== "General Inquiry") {
        setFormData(prev => ({
          ...prev,
          message: `I would like to initiate a request for: ${source}. Let's discuss the technical requirements and timeline.`
        }));
      } else {
        setFormData({ name: '', email: '', company: '', message: '' });
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, source, isAudit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('projects').insert([{
        name: formData.name,
        email: formData.email,
        company: formData.company,
        message: formData.message,
        source: source
      }]);
      
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: '', email: '', company: '', message: '' });
      }, 3000);
    } catch (error: any) {
      console.error('Appwrite Error:', error);
      alert(`Foundry Error: Transmission failed. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" key="modal-overlay">
          {/* Opaque backdrop for focus */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl"
          />
          
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(139,92,246,0.3)] z-[10001] max-h-[90vh] flex flex-col"
          >
            <div className="p-8 md:p-12 relative bg-[#0a0a0a] flex-1 overflow-y-auto">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-all z-[10002] bg-neutral-900/50 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              {!success ? (
                <>
                  <div className="flex items-start gap-5 mb-10">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 shrink-0",
                      isAudit ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                    )}>
                      {isAudit ? <BarChart3 className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tighter leading-none mb-2 pt-1">
                        {isAudit ? 'Forge Audit' : 'Initiate Intake'}
                      </h2>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-[0.4em] font-black">
                        Target: {source}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-neutral-500 px-1">
                          <User className="w-3 h-3 text-purple-500" /> Identity
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Lead Architect"
                          className="w-full bg-neutral-900/40 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 focus:outline-none transition-all text-white placeholder:text-neutral-700"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-neutral-500 px-1">
                          <Building2 className="w-3 h-3 text-blue-500" /> Firm
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          placeholder="Corporation"
                          className="w-full bg-neutral-900/40 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 focus:outline-none transition-all text-white placeholder:text-neutral-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-neutral-500 px-1">
                        <Mail className="w-3 h-3 text-emerald-500" /> Neural Link
                      </label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="secure@foundry.ai"
                        className="w-full bg-neutral-900/40 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 focus:outline-none transition-all text-white placeholder:text-neutral-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-neutral-500 px-1">
                        <MessageCircle className="w-3 h-3 text-amber-500" /> Parameters
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Define scope..."
                        className="w-full bg-neutral-900/40 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 focus:outline-none transition-all resize-none text-white placeholder:text-neutral-700 leading-relaxed"
                      />
                    </div>

                    <button
                      disabled={loading}
                      type="submit"
                      className="group w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all active:scale-[0.98] shadow-xl mt-4"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {isAudit ? 'Begin Audit Protocol' : 'Sync with Foundry'}
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-6 pt-4 opacity-50">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Priority Queue</span>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <div className="py-20 flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 rounded-[2rem] bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/30"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-4 font-['Space_Grotesk']">Sync Established</h2>
                  <p className="text-neutral-500 text-base max-w-xs mb-8 font-medium">
                    Your request has been forged. An AI architect will initialize contact shortly.
                  </p>
                  <div className="px-6 py-2 rounded-full border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-[0.3em] animate-pulse">
                    Active Sync Mode
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
