'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldAlert, Users, Layers, MessageSquare, 
  Trash2, RefreshCw, Database, ArrowUpRight, AlertTriangle,
  Lock, Mail, Eye, EyeOff, User, Settings, ShieldCheck, 
  Send, Key, LogOut, CheckCircle2, ChevronRight, Edit3,
  Search
} from 'lucide-react';
import { account, databases, teams, DATABASE_ID, COLLECTION_ID_LEADS, COLLECTION_ID_PROFILES } from '../../lib/appwrite';
import { Query } from 'appwrite';
import { cn } from '../../lib/utils';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'users' | 'profile' | 'stats'>('leads');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Data
  const [leads, setLeads] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalLeads: 0, totalUsers: 0 });

  // Self Management
  const [newAdminPass, setNewAdminPass] = useState("");
  const [passUpdateMsg, setPassUpdateMsg] = useState("");

  // Detailed View Modal
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const checkAuth = async () => {
    setAuthLoading(true);
    try {
      const user = await account.get();
      // Check if user belongs to 'admin' team
      const teamList = await teams.list();
      const isAdmin = teamList.teams.some(t => t.name.toLowerCase() === 'admin');
      
      if (isAdmin) {
        setIsAuthorized(true);
        setAdminUser(user);
        fetchData();
      } else {
        setIsAuthorized(false);
        setError("Access Denied: Your account is not authorized for the Admin Protocol.");
      }
    } catch (err) {
      setIsAuthorized(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);
    try {
      try { await account.deleteSession('current'); } catch (e) {} // Clear existing
      await account.createEmailPasswordSession(loginEmail, loginPassword);
      await checkAuth();
    } catch (err: any) {
      setError(err.message || "Invalid credentials for Shadow Console.");
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsRes, usersRes] = await Promise.all([
        databases.listDocuments(DATABASE_ID, COLLECTION_ID_LEADS, [Query.orderDesc('$createdAt'), Query.limit(100)]),
        databases.listDocuments(DATABASE_ID, COLLECTION_ID_PROFILES, [Query.orderDesc('$createdAt'), Query.limit(100)])
      ]);
      setLeads(leadsRes.documents);
      setUsers(usersRes.documents);
      setStats({ totalLeads: leadsRes.total, totalUsers: usersRes.total });
    } catch (err: any) {
      setError("Sync Failure: Database unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collectionId: string, docId: string) => {
    if (!confirm("Confirm permanent data deletion?")) return;
    try {
      await databases.deleteDocument(DATABASE_ID, collectionId, docId);
      fetchData();
    } catch (err) { alert("Execution Error."); }
  };

  const handleResetUserPassword = async (email: string) => {
    try {
      await account.createRecovery(email, `${window.location.origin}/reset-password`);
      alert(`Recovery protocol initialized for ${email}`);
    } catch (err) { alert("Recovery sequence failed."); }
  };

  const handleUpdateAdminPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassUpdateMsg("Updating...");
    try {
      await account.updatePassword(newAdminPass);
      setPassUpdateMsg("Password Secured Successfully.");
      setNewAdminPass("");
      setTimeout(() => setPassUpdateMsg(""), 3000);
    } catch (err: any) {
      setPassUpdateMsg(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    if (isOpen) checkAuth();
  }, [isOpen]);

  const renderLogin = () => (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-neutral-900/50 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-white uppercase tracking-[0.3em] text-center">Admin Access</h2>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-2 font-black">Secure Authentication Required</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              required
              type="email"
              placeholder="Admin Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full bg-black border border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-700"
            />
          </div>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              required
              type={showPass ? "text" : "password"}
              placeholder="Master Secret"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full bg-black border border-white/5 rounded-xl pl-12 pr-12 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-700"
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center rounded-xl">{error}</div>}
          <button
            disabled={authLoading}
            type="submit"
            className="w-full py-5 bg-white text-black rounded-xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all active:scale-[0.98]"
          >
            {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Authorize Access"}
          </button>
        </form>
      </motion.div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[50000] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/95 backdrop-blur-2xl" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full max-w-6xl h-[85vh] bg-[#050505] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl z-[50001] flex flex-col"
          >
            {!isAuthorized ? renderLogin() : (
              <>
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] tracking-tight">System Core Dashboard</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-black">Operator: {adminUser?.name}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={fetchData} className="p-3 text-neutral-500 hover:text-white transition-all bg-white/5 rounded-xl"><RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /></button>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all"><X className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                  {/* Sidebar Nav */}
                  <div className="w-64 border-r border-white/5 bg-black/20 p-6 flex flex-col gap-2">
                    {[
                      { id: 'leads', label: 'Intake Stream', icon: MessageSquare },
                      { id: 'users', label: 'Identity Registry', icon: Users },
                      { id: 'stats', label: 'Performance', icon: Layers },
                      { id: 'profile', label: 'Core Settings', icon: Settings }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          "w-full px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 transition-all",
                          activeTab === tab.id ? "bg-white text-black shadow-lg shadow-white/5" : "text-neutral-500 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                    <div className="mt-auto pt-6 border-t border-white/5">
                        <button 
                          onClick={() => { account.deleteSession('current'); setIsAuthorized(false); }}
                          className="w-full px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          De-Authorize
                        </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 overflow-auto p-10">
                    {activeTab === 'leads' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-8">
                          <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Lead Signatures</h3>
                          <div className="flex items-center gap-3 bg-neutral-900 px-4 py-2 rounded-xl border border-white/5">
                            {/* Fixed: Added 'Search' to lucide-react imports */}
                            <Search className="w-3.5 h-3.5 text-neutral-600" />
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Live Buffer</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {leads.map((lead) => (
                            <div key={lead.$id} className="group bg-neutral-900/30 border border-white/5 p-6 rounded-[2rem] hover:border-purple-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                              <div className="flex gap-6 items-center">
                                <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-center shrink-0">
                                  <User className="w-5 h-5 text-neutral-500" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-lg font-bold text-white">{lead.name}</h4>
                                    <span className="text-[8px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-black uppercase border border-purple-500/20">{lead.source}</span>
                                  </div>
                                  <p className="text-xs text-neutral-500 flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> {lead.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex-1 max-w-md">
                                <p className="text-[11px] text-neutral-400 leading-relaxed italic line-clamp-2">"{lead.message}"</p>
                              </div>
                              <div className="flex items-center gap-3 ml-auto">
                                <button onClick={() => setSelectedLead(lead)} className="px-5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-all">Expand View</button>
                                <button onClick={() => handleDelete(COLLECTION_ID_LEADS, lead.$id)} className="p-2.5 text-neutral-600 hover:text-red-400 bg-red-500/5 rounded-xl border border-red-500/10"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'users' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-8">
                          <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Identity Registry</h3>
                          <span className="text-[10px] px-4 py-2 bg-neutral-900 rounded-xl border border-white/5 text-neutral-500 font-black uppercase tracking-widest">{stats.totalUsers} Active Nodes</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {users.map((user) => (
                            <div key={user.$id} className="bg-neutral-900/30 border border-white/5 p-6 rounded-[2rem] hover:border-blue-500/30 transition-all flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-center">
                                  <AtSign className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-white">@{user.username} <span className="ml-2 text-[8px] font-black text-neutral-600 uppercase">({user.role})</span></h4>
                                  <p className="text-xs text-neutral-500">{user.name} | {user.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => handleResetUserPassword(user.email)}
                                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/10 transition-all"
                                >
                                  <Key className="w-3.5 h-3.5" /> Force Reset
                                </button>
                                <button onClick={() => handleDelete(COLLECTION_ID_PROFILES, user.$id)} className="p-2.5 text-neutral-600 hover:text-red-400 bg-red-500/5 rounded-xl border border-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'profile' && (
                      <div className="max-w-2xl mx-auto space-y-12">
                        <div className="p-10 rounded-[3rem] bg-neutral-900/50 border border-white/10 text-center">
                          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                            <ShieldCheck className="w-10 h-10 text-emerald-400" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">Core Security Settings</h3>
                          <p className="text-neutral-500 text-sm">Update your administrative credentials and security tokens.</p>
                        </div>

                        <div className="space-y-8 bg-neutral-950 p-10 rounded-[3rem] border border-white/5">
                          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400 flex items-center gap-3">
                            <Lock className="w-4 h-4" /> Update Master Password
                          </h4>
                          <form onSubmit={handleUpdateAdminPass} className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase tracking-widest text-neutral-600 ml-2">New Secret Token</label>
                               <input
                                required
                                type="password"
                                value={newAdminPass}
                                onChange={(e) => setNewAdminPass(e.target.value)}
                                placeholder="Enter high-entropy password..."
                                className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                               />
                            </div>
                            <button
                              type="submit"
                              className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-purple-500 transition-all active:scale-[0.98]"
                            >
                              Commit Update
                            </button>
                            {passUpdateMsg && <p className="text-center text-[10px] font-black text-purple-400 uppercase tracking-widest">{passUpdateMsg}</p>}
                          </form>
                        </div>
                      </div>
                    )}

                    {activeTab === 'stats' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                          { label: "Intake Conversion", value: `${Math.round((stats.totalLeads / (stats.totalUsers || 1)) * 100)}%`, icon: ArrowUpRight, desc: "Lead to Identity conversion ratio.", color: "text-emerald-400" },
                          { label: "Data Integrity", value: "99.9%", icon: ShieldCheck, desc: "Neural link uptime and parity.", color: "text-blue-400" },
                          { label: "Total Leads", value: stats.totalLeads, icon: MessageSquare, desc: "Unique signatures in database.", color: "text-purple-400" },
                          { label: "Registry Size", value: stats.totalUsers, icon: Users, desc: "Verified system identities.", color: "text-amber-400" }
                        ].map((s, i) => (
                          <div key={i} className="p-10 rounded-[3rem] bg-neutral-900/30 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all group">
                             <div className="flex justify-between items-start mb-8">
                               <div className={cn("w-14 h-14 rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-center", s.color)}>
                                 <s.icon className="w-6 h-6" />
                               </div>
                               <span className="text-[10px] font-black text-neutral-700 group-hover:text-neutral-500 transition-colors uppercase tracking-widest">Live Matrix</span>
                             </div>
                             <div>
                               <div className="text-5xl font-bold text-white mb-2 tracking-tighter">{s.value}</div>
                               <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4">{s.label}</h5>
                               <p className="text-xs text-neutral-600 leading-relaxed font-medium">{s.desc}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Lead Detail Modal */}
          <AnimatePresence>
            {selectedLead && (
              <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLead(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.2)]">
                  <button onClick={() => setSelectedLead(null)} className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-20 h-20 rounded-[2rem] bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                      <MessageSquare className="w-10 h-10 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white font-['Space_Grotesk'] tracking-tight">{selectedLead.name}</h3>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest font-black mt-1">Source: {selectedLead.source}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-2">Email Identity</p>
                        <p className="text-white font-medium">{selectedLead.email}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-2">Corporate Entity</p>
                        <p className="text-white font-medium">{selectedLead.company || "Independent Architect"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-2">Transmission Date</p>
                        <p className="text-white font-medium">{new Date(selectedLead.timestamp || selectedLead.$createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-2">Lead Status</p>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">Verified Protocol</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-4">Parameter Payload</p>
                      <div className="p-8 bg-neutral-900/50 rounded-[2rem] border border-white/5 text-neutral-300 text-base leading-relaxed whitespace-pre-wrap font-medium">
                        {selectedLead.message}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}

const AtSign = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>
);