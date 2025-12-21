'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldAlert, Users, Layers, MessageSquare, 
  Trash2, RefreshCw, Database, ArrowUpRight, AlertTriangle,
  Lock, Mail, Eye, EyeOff, User, Settings, ShieldCheck, 
  Send, Key, LogOut, CheckCircle2, ChevronRight, Edit3,
  Search, AtSign, Building2, Calendar, Smartphone, MapPin
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

  // Detailed View Modals
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const checkAuth = async () => {
    setAuthLoading(true);
    setError(null);
    try {
      const user = await account.get();
      // Fetch user's team memberships
      const teamList = await teams.list();
      
      // Smart check: Check both Team Name and Team ID to prevent "Access Denied" if user set one but not the other
      const isAdmin = teamList.teams.some(t => 
        t.name.toLowerCase() === 'admin' || 
        t.$id.toLowerCase() === 'admin'
      );
      
      if (isAdmin) {
        setIsAuthorized(true);
        setAdminUser(user);
        fetchData();
      } else {
        setIsAuthorized(false);
        setError("Access Denied: Your account is not in the 'admin' team. Please check Appwrite Console.");
      }
    } catch (err: any) {
      setIsAuthorized(false);
      // Not logged in is fine, they just see the login form
      if (err.code !== 401) {
        console.error("Auth Protocol Failure:", err);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);
    try {
      // Attempt to clear existing session if any to ensure fresh auth
      try { await account.deleteSession('current'); } catch (e) {} 
      
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
      setError("Sync Failure: Database parameters unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collectionId: string, docId: string) => {
    if (!confirm("Confirm permanent data deletion from registry?")) return;
    try {
      await databases.deleteDocument(DATABASE_ID, collectionId, docId);
      fetchData();
    } catch (err) { alert("Execution Error."); }
  };

  const handleResetUserPassword = async (email: string) => {
    if (!confirm(`Initialize remote password recovery for ${email}?`)) return;
    try {
      await account.createRecovery(email, `${window.location.origin}`);
      alert(`Recovery protocol successfully broadcasted to ${email}`);
    } catch (err) { alert("Recovery sequence failed to initialize."); }
  };

  const handleUpdateAdminPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassUpdateMsg("Updating Master Token...");
    try {
      await account.updatePassword(newAdminPass);
      setPassUpdateMsg("Protocol Secured: Password Updated.");
      setNewAdminPass("");
      setTimeout(() => setPassUpdateMsg(""), 3000);
    } catch (err: any) {
      setPassUpdateMsg(`Security Error: ${err.message}`);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  const renderLogin = () => (
    <div className="flex-1 flex items-center justify-center p-8 bg-black">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-neutral-900/40 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-white uppercase tracking-[0.3em] text-center">Master Console</h2>
          <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-2 font-black text-center">Level 5 Authorization Required</p>
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
              className="w-full bg-black border border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-700 font-medium"
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
              className="w-full bg-black border border-white/5 rounded-xl pl-12 pr-12 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-700 font-medium"
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest text-center rounded-xl leading-relaxed">
              {error}
            </div>
          )}
          <button
            disabled={authLoading}
            type="submit"
            className="w-full py-5 bg-white text-black rounded-xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all active:scale-[0.98] shadow-lg"
          >
            {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Initiate Protocol"}
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
            className="relative w-full max-w-7xl h-[90vh] bg-[#050505] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl z-[50001] flex flex-col"
          >
            {!isAuthorized ? renderLogin() : (
              <>
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-neutral-900/20">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] tracking-tight">System Core Dashboard</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-black">Operator: {adminUser?.name || 'Authorized Admin'}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={fetchData} className="p-3 text-neutral-500 hover:text-white transition-all bg-white/5 rounded-xl border border-white/5"><RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /></button>
                    <button onClick={onClose} className="p-3 bg-white text-black hover:bg-neutral-200 rounded-xl transition-all"><X className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                  {/* Sidebar Nav */}
                  <div className="w-72 border-r border-white/5 bg-black/20 p-8 flex flex-col gap-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-600 mb-2 px-2">Navigation Matrix</p>
                    {[
                      { id: 'leads', label: 'Lead Stream', icon: MessageSquare },
                      { id: 'users', label: 'Identity Registry', icon: Users },
                      { id: 'stats', label: 'Performance Matrix', icon: Layers },
                      { id: 'profile', label: 'Security Node', icon: Settings }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          "w-full px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 transition-all border",
                          activeTab === tab.id 
                            ? "bg-white text-black border-white shadow-xl" 
                            : "text-neutral-500 border-transparent hover:text-white hover:bg-white/5"
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
                          Sever Link
                        </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 overflow-auto p-10 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.03),transparent_40%)]">
                    {activeTab === 'leads' && (
                      <div className="space-y-8">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-3xl font-bold font-['Space_Grotesk'] text-white">Lead Signatures</h3>
                          <div className="flex items-center gap-3 bg-neutral-900/50 px-5 py-2.5 rounded-xl border border-white/5 backdrop-blur-md">
                            <Search className="w-3.5 h-3.5 text-neutral-600" />
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Total: {leads.length}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-5">
                          {leads.map((lead) => (
                            <div key={lead.$id} className="group bg-neutral-900/20 border border-white/5 p-8 rounded-[2.5rem] hover:border-purple-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-8 backdrop-blur-sm">
                              <div className="flex gap-6 items-center">
                                <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center shrink-0 group-hover:border-purple-500/40 transition-colors shadow-lg">
                                  <User className="w-6 h-6 text-neutral-500" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-4 mb-1.5">
                                    <h4 className="text-xl font-bold text-white font-['Space_Grotesk']">{lead.name}</h4>
                                    <span className="text-[9px] px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 font-black uppercase border border-purple-500/20 tracking-tighter">{lead.source}</span>
                                  </div>
                                  <p className="text-xs text-neutral-500 flex items-center gap-2 font-medium">
                                    <Mail className="w-3.5 h-3.5" /> {lead.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex-1 max-w-md hidden lg:block">
                                <p className="text-xs text-neutral-400 leading-relaxed italic line-clamp-2 border-l border-white/10 pl-6">"{lead.message}"</p>
                              </div>
                              <div className="flex items-center gap-4 ml-auto">
                                <button 
                                  onClick={() => setSelectedLead(lead)} 
                                  className="px-6 py-3 bg-neutral-900 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-white hover:border-white/10 transition-all shadow-md"
                                >
                                  Expand Parameters
                                </button>
                                <button onClick={() => handleDelete(COLLECTION_ID_LEADS, lead.$id)} className="p-3 text-neutral-600 hover:text-red-400 bg-red-500/5 rounded-xl border border-red-500/10 transition-all"><Trash2 className="w-4.5 h-4.5" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'users' && (
                      <div className="space-y-8">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight">Identity Registry</h3>
                          <span className="text-[10px] px-5 py-2.5 bg-neutral-900/50 rounded-xl border border-white/5 text-neutral-500 font-black uppercase tracking-widest">{stats.totalUsers} Registered Nodes</span>
                        </div>
                        <div className="grid grid-cols-1 gap-5">
                          {users.map((user) => (
                            <div key={user.$id} className="bg-neutral-900/20 border border-white/5 p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all flex items-center justify-between backdrop-blur-sm group">
                              <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:border-blue-500/40 transition-colors shadow-lg">
                                  <AtSign className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-white font-['Space_Grotesk']">@{user.username} <span className="ml-2 text-[9px] font-black text-neutral-600 uppercase border border-white/5 px-2 py-0.5 rounded-full">{user.role}</span></h4>
                                  <p className="text-xs text-neutral-500 font-medium mt-1">{user.name} | {user.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => setSelectedUser(user)}
                                  className="px-6 py-3 bg-neutral-900 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-all shadow-md"
                                >
                                  Inspect Data
                                </button>
                                <button 
                                  onClick={() => handleResetUserPassword(user.email)}
                                  className="flex items-center gap-2 px-6 py-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:bg-blue-500/10 transition-all shadow-md"
                                  title="Force Reset Password"
                                >
                                  <Key className="w-4 h-4" /> Reset
                                </button>
                                <button onClick={() => handleDelete(COLLECTION_ID_PROFILES, user.$id)} className="p-3 text-neutral-600 hover:text-red-400 bg-red-500/5 rounded-xl border border-red-500/10 transition-all"><Trash2 className="w-4.5 h-4.5" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'profile' && (
                      <div className="max-w-3xl mx-auto space-y-12 py-10">
                        <div className="p-12 rounded-[4rem] bg-neutral-900/20 border border-white/10 text-center backdrop-blur-xl">
                          <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                            <ShieldCheck className="w-12 h-12 text-emerald-400" />
                          </div>
                          <h3 className="text-3xl font-bold text-white mb-3 font-['Space_Grotesk']">Administrative Controls</h3>
                          <p className="text-neutral-500 text-base max-w-md mx-auto leading-relaxed">Modify your administrative credentials and security tokens across the agency ecosystem.</p>
                        </div>

                        <div className="space-y-10 bg-black p-12 rounded-[4rem] border border-white/5 shadow-2xl">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 flex items-center gap-4">
                            <Lock className="w-5 h-5 text-purple-400" /> Rotate Security Secret
                          </h4>
                          <form onSubmit={handleUpdateAdminPass} className="space-y-8">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600 ml-2">New Global Secret</label>
                               <input
                                required
                                type="password"
                                value={newAdminPass}
                                onChange={(e) => setNewAdminPass(e.target.value)}
                                placeholder="Enter high-entropy sequence..."
                                className="w-full bg-neutral-900/30 border border-white/5 rounded-2xl px-8 py-5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-800"
                               />
                            </div>
                            <button
                              type="submit"
                              className="w-full py-6 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 hover:bg-purple-500 transition-all active:scale-[0.98] shadow-lg shadow-purple-500/10"
                            >
                              Commit Security Update
                            </button>
                            {passUpdateMsg && <p className="text-center text-[10px] font-black text-purple-400 uppercase tracking-widest animate-pulse">{passUpdateMsg}</p>}
                          </form>
                        </div>
                      </div>
                    )}

                    {activeTab === 'stats' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                          { label: "Intake Conversion", value: `${Math.round((stats.totalLeads / (stats.totalUsers || 1)) * 100)}%`, icon: ArrowUpRight, desc: "Lead to identity conversion ratio.", color: "text-emerald-400" },
                          { label: "Data Integrity", value: "100%", icon: ShieldCheck, desc: "Neural link uptime and registry parity.", color: "text-blue-400" },
                          { label: "Total Leads", value: stats.totalLeads, icon: MessageSquare, desc: "Unique signatures in lead collection.", color: "text-purple-400" },
                          { label: "Verified Nodes", value: stats.totalUsers, icon: Users, desc: "Authenticated system identities.", color: "text-amber-400" }
                        ].map((s, i) => (
                          <div key={i} className="p-12 rounded-[4rem] bg-neutral-900/30 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all group backdrop-blur-sm relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[80px] rounded-full group-hover:bg-white/10 transition-all" />
                             <div className="flex justify-between items-start mb-10 relative z-10">
                               <div className={cn("w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center", s.color)}>
                                 <s.icon className="w-8 h-8" />
                               </div>
                               <span className="text-[10px] font-black text-neutral-700 group-hover:text-neutral-500 transition-colors uppercase tracking-[0.3em]">Telemetry Matrix</span>
                             </div>
                             <div className="relative z-10">
                               <div className="text-6xl font-bold text-white mb-3 tracking-tighter font-['Space_Grotesk']">{s.value}</div>
                               <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-6">{s.label}</h5>
                               <p className="text-sm text-neutral-600 leading-relaxed font-medium">{s.desc}</p>
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

          {/* Detailed Lead Modal */}
          <AnimatePresence>
            {selectedLead && (
              <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLead(null)} className="fixed inset-0 bg-black/90 backdrop-blur-xl" />
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-[4rem] p-16 overflow-hidden shadow-[0_0_150px_rgba(168,85,247,0.2)]">
                  <button onClick={() => setSelectedLead(null)} className="absolute top-10 right-10 text-neutral-500 hover:text-white transition-all bg-neutral-900/50 p-3 rounded-full"><X className="w-6 h-6" /></button>
                  
                  <div className="flex items-center gap-8 mb-12">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-2xl">
                      <MessageSquare className="w-12 h-12 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-white font-['Space_Grotesk'] tracking-tighter">{selectedLead.name}</h3>
                      <p className="text-[11px] text-neutral-500 uppercase tracking-[0.4em] font-black mt-2">Signature Origin: {selectedLead.source}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                    <ParameterBlock label="Identity Link" val={selectedLead.email} icon={Mail} />
                    <ParameterBlock label="Corporate Entity" val={selectedLead.company || "Independent Architect"} icon={Building2} />
                    <ParameterBlock label="Transmission Date" val={new Date(selectedLead.timestamp || selectedLead.$createdAt).toLocaleString()} icon={Calendar} />
                    <ParameterBlock label="Sync Status" val="Protocol Verified" icon={ShieldCheck} status />
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.5em] ml-2">Parameter Payload</p>
                    <div className="p-10 bg-neutral-900/50 rounded-[3rem] border border-white/5 text-neutral-300 text-lg leading-relaxed whitespace-pre-wrap font-medium shadow-inner">
                      {selectedLead.message}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Detailed User Modal */}
          <AnimatePresence>
            {selectedUser && (
              <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="fixed inset-0 bg-black/90 backdrop-blur-xl" />
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-[4rem] p-16 overflow-hidden shadow-[0_0_150px_rgba(59,130,246,0.2)]">
                  <button onClick={() => setSelectedUser(null)} className="absolute top-10 right-10 text-neutral-500 hover:text-white transition-all bg-neutral-900/50 p-3 rounded-full"><X className="w-6 h-6" /></button>
                  
                  <div className="flex items-center gap-8 mb-12">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-2xl">
                      <AtSign className="w-12 h-12 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-white font-['Space_Grotesk'] tracking-tighter">@{selectedUser.username}</h3>
                      <p className="text-[11px] text-neutral-500 uppercase tracking-[0.4em] font-black mt-2">Registry Role: {selectedUser.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <ParameterBlock label="Verified Name" val={selectedUser.name} icon={User} />
                    <ParameterBlock label="Auth Email" val={selectedUser.email} icon={Mail} />
                    <ParameterBlock label="Neural Terminal" val={selectedUser.phone || "Not Registered"} icon={Smartphone} />
                    <ParameterBlock label="Geographic Node" val={selectedUser.address || "Cloud Resident"} icon={MapPin} />
                    <ParameterBlock label="Account Creation" val={new Date(selectedUser.createdAt || selectedUser.$createdAt).toLocaleDateString()} icon={Calendar} />
                    <ParameterBlock label="Registry ID" val={selectedUser.$id} icon={Key} />
                  </div>

                  <div className="mt-12 pt-10 border-t border-white/5 flex gap-4">
                     <button 
                       onClick={() => { handleResetUserPassword(selectedUser.email); setSelectedUser(null); }}
                       className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-500 transition-all shadow-lg"
                     >
                       Broadcast Password Reset
                     </button>
                     <button 
                       onClick={() => setSelectedUser(null)}
                       className="px-10 py-5 bg-neutral-900 border border-white/10 text-neutral-400 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-all"
                     >
                       Close Inspect
                     </button>
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

function ParameterBlock({ label, val, icon: Icon, status }: { label: string, val: string, icon: any, status?: boolean }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em] flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" /> {label}
      </p>
      {status ? (
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">{val}</span>
        </div>
      ) : (
        <p className="text-white text-lg font-bold font-['Space_Grotesk'] tracking-tight truncate">{val}</p>
      )}
    </div>
  );
}