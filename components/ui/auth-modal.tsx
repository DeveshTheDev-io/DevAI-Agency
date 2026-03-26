'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ShieldCheck, Mail, Lock, User, Phone, MapPin, ArrowRight, AtSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '', // New field
    email: '',
    password: '',
    name: '',
    phone: '',
    address: ''
  });

  // Reset mode and data when the modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        name: '',
        phone: '',
        address: ''
      });
    }
  }, [isOpen, initialMode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { data: existingUsers, error: userCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('username', formData.username.toLowerCase());
          
        if (userCheckError) throw userCheckError;
        if (existingUsers && existingUsers.length > 0) {
          throw new Error("This username is already claimed in the forge.");
        }

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            }
          }
        });

        if (signUpError) throw signUpError;
        if (!authData.user) throw new Error("Account creation failed.");

        try {
          const { error: profileErr } = await supabase.from('users').insert({
            id: authData.user.id,
            username: formData.username.toLowerCase(),
            full_name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            role: 'user'
          });
          if (profileErr) throw profileErr;
        } catch (profileErr) {
          console.error("Profile creation failed, but account exists:", profileErr);
        }

        onSuccess(authData.user);
      } else {
        const { data: profileSearch, error: searchErr } = await supabase
          .from('users')
          .select('email')
          .eq('username', formData.username.toLowerCase());

        if (searchErr) throw searchErr;
        if (!profileSearch || profileSearch.length === 0) {
          throw new Error("Identity not found. Please verify your username.");
        }

        const userEmail = profileSearch[0].email;

        const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: formData.password,
        });
        
        if (loginErr) throw loginErr;
        onSuccess(loginData.user);
      }
      onClose();
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "Authentication failed. Check your parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-neutral-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl z-[20001]"
          >
            <div className="p-8 md:p-10">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                  <ShieldCheck className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
                  {mode === 'signup' ? 'Forge Identity' : 'Initialize Session'}
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  {mode === 'signup' ? 'Join the Dev AI Agency ecosystem.' : 'Authorize access with your unique handle.'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {/* Always show Username for both Login and Signup */}
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    required
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-neutral-900 border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-600"
                  />
                </div>

                {mode === 'signup' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        required
                        type="text"
                        placeholder="Full Legal Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-neutral-900 border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-600"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        required
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-neutral-900 border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-600"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        required
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-neutral-900 border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-600"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        required
                        type="text"
                        placeholder="Physical Address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-neutral-900 border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-600"
                      />
                    </div>
                  </div>
                )}

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    required
                    type="password"
                    placeholder="Secure Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-neutral-900 border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-600"
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all active:scale-[0.98] mt-6 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {mode === 'signup' ? 'Register Identity' : 'Authorize Session'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-xs text-neutral-500 hover:text-white transition-colors uppercase tracking-widest font-bold"
                >
                  {mode === 'login' ? "New Architect? Create handle" : "Identity Forge Complete? Login"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}