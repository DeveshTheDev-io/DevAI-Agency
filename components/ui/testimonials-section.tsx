import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquarePlus, Quote, Loader2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { AuthModal } from './auth-modal';

const INDIAN_TESTIMONIALS = [
  { name: "Rajesh Kumar", role: "CTO, TechVision India", content: "Devscosmic A.I completely transformed our backend architecture. The agents scaled our operations overnight. Unbelievable precision." },
  { name: "Priya Sharma", role: "Founder, GrowthX", content: "The ROI we've seen from deploying the Lead Gen Scout is unbelievable. It's like having a full sales team working 24/7 without any breaks." },
  { name: "Amit Patel", role: "VP Engineering, DataFlow", content: "I was skeptical about AI agents at first, but the Database Optimizer found inefficiencies my human team missed for months. Outstanding." },
  { name: "Neha Gupta", role: "Marketing Director, Elevate", content: "Our content velocity increased by 400% while maintaining our brand's unique voice. Absolutely game-changing for our marketing." },
  { name: "Vikram Singh", role: "CEO, Startup Hub", content: "Dev Yadav and his digital workforce built our MVP in 3 days. We secured seed funding the following week thanks to the prototype." },
  { name: "Anjali Desai", role: "Operations Manager", content: "The Calendar Architect handles everything. No more double bookings or scheduling conflicts. It has completely automated my workflow." }
];

export function TestimonialsSection() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  
  // Review Form State
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRole, setReviewRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReviews, setLocalReviews] = useState(INDIAN_TESTIMONIALS);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddReviewClick = () => {
    if (session) {
      setIsReviewModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (user: any) => {
    // Auth was successful, open review modal
    setIsReviewModalOpen(true);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;
    
    setIsSubmitting(true);
    // In a real app we'd push this to supabase: 
    // await supabase.from('testimonials').insert({...})
    
    // For now, simulate an API call and add to local state
    setTimeout(() => {
      const newReview = {
        name: session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || "Anonymous User",
        role: reviewRole || "Verified Client",
        content: reviewContent
      };
      setLocalReviews(prev => [newReview, ...prev]);
      setIsSubmitting(false);
      setIsReviewModalOpen(false);
      setReviewContent("");
      setReviewRole("");
    }, 1000);
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent blur-3xl rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-[1920px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-[9px] font-black uppercase tracking-[0.3em] text-purple-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Client Success
            </div>
            <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9]">
              Voices of the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Automated Era.</span>
            </h2>
          </div>

          <button 
            onClick={handleAddReviewClick}
            className="group px-6 py-3 rounded-xl border border-white/10 bg-neutral-900/50 hover:bg-white hover:text-black hover:border-white transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white shadow-xl"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Add Review</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localReviews.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="p-8 rounded-3xl bg-neutral-950/40 border border-white/[0.06] hover:border-purple-500/30 transition-colors relative group"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-white/[0.02] group-hover:text-purple-500/10 transition-colors" />
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-purple-500 text-purple-500" />
                ))}
              </div>
              <p className="text-neutral-300 leading-relaxed mb-8 relative z-10">"{testimonial.content}"</p>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white text-sm shrink-0">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-tight">{testimonial.name}</h4>
                  <p className="text-xs text-neutral-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
      />

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsReviewModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-neutral-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl p-8 z-[20001]">
            <button 
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Share Your Experience</h3>
              <p className="text-neutral-500 text-sm">Tell us how the Devscosmic A.I agents helped scale your business.</p>
            </div>

            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-2">Your Role / Company (Optional)</label>
                <input 
                  type="text"
                  value={reviewRole}
                  onChange={(e) => setReviewRole(e.target.value)}
                  placeholder="e.g. CEO at TechCorp"
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-2">Your Review</label>
                <textarea 
                  required
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Write your testimonial here..."
                  rows={4}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-purple-500 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-purple-400 transition-all active:scale-[0.98] mt-6 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
