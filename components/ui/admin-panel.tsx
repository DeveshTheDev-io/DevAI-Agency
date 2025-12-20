'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldAlert, Users, Layers, MessageSquare, 
  Trash2, RefreshCw, CheckCircle, ExternalLink, 
  Search, Filter, Database, ArrowUpRight, AlertTriangle
} from 'lucide-react';
import { databases, DATABASE_ID, COLLECTION_ID_LEADS, COLLECTION_ID_PROFILES } from '../../lib/appwrite';
import { Query } from 'appwrite';
import { cn } from '../../lib/utils';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'leads' | 'users' | 'stats'>('leads');
  const [leads, setLeads] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalLeads: 0, totalUsers: 0 });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Parallel fetching for performance
      const [leadsRes, usersRes] = await Promise.all([
        databases.listDocuments(DATABASE_ID, COLLECTION_ID_LEADS, [
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]),
        databases.listDocuments(DATABASE_ID, COLLECTION_ID_PROFILES, [
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ])
      ]);
      
      setLeads(leadsRes.documents);
      setUsers(usersRes.documents);
      setStats({
        totalLeads: leadsRes.total,
        totalUsers: usersRes.total
      });
    } catch (err: any) {
      console.error("Foundry Admin Fetch Error:", err);
      // Handle "Failed to fetch" which is often CORS or Endpoint issues
      if (err.message?.includes('fetch') || !err.status) {
        setError("Network Link Failure: Ensure your domain is authorized in the Appwrite Console and the endpoint is reachable.");
      } else {
        setError(err.message || "Unknown database error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  const handleDelete = async (collectionId: string, docId: string) => {
    if (!confirm("Are you sure you want to scrub this entry?")) return;
    try {
      await databases.deleteDocument(DATABASE_ID, collectionId, docId);
      fetchData();
    } catch (err) {
      alert("Foundry Error: Execution failed.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[50000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full max-w-6xl h-[85vh] bg-neutral-950 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl z-[50001] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <ShieldAlert className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] tracking-tight">Shadow Dashboard</h2>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-black">Authorized Personnel Only</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={fetchData} className="p-3 text-neutral-500 hover:text-white transition-all"><RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /></button>
                <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-8 mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-[11px] font-bold text-red-400 uppercase tracking-widest">{error}</p>
                <button onClick={fetchData} className="ml-auto text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-white underline">Retry Sync</button>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Navigation Tabs */}
              <div className="flex p-2 bg-black/40 gap-2 m-4 rounded-2xl border border-white/5 w-fit">
                {[
                  { id: 'leads', label: 'Intake Stream', icon: MessageSquare },
                  { id: 'users', label: 'Registry', icon: Users },
                  { id: 'stats', label: 'Metrics', icon: Layers }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all",
                      activeTab === tab.id ? "bg-white text-black" : "text-neutral-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Table Area */}
              <div className="flex-1 overflow-auto px-6 pb-6">
                {!loading && leads.length === 0 && users.length === 0 && !error ? (
                   <div className="h-full flex flex-col items-center justify-center text-neutral-600">
                      <Database className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No data signatures detected</p>
                   </div>
                ) : (
                  <>
                    {activeTab === 'leads' && (
                      <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                          <tr className="text-neutral-500 text-[9px] uppercase font-black tracking-[0.2em] px-4">
                            <th className="pb-4 pl-4">Timestamp</th>
                            <th className="pb-4">Source</th>
                            <th className="pb-4">Lead Identity</th>
                            <th className="pb-4">Parameters</th>
                            <th className="pb-4 text-right pr-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leads.map((lead) => (
                            <tr key={lead.$id} className="group bg-white/5 hover:bg-white/[0.08] transition-all rounded-2xl overflow-hidden">
                              <td className="py-4 pl-4 text-[10px] text-neutral-400 rounded-l-2xl">
                                {new Date(lead.$createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-4">
                                <span className="text-[9px] px-2 py-0.5 rounded-full border border-purple-500/20 text-purple-400 font-bold uppercase">{lead.source}</span>
                              </td>
                              <td className="py-4">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-white">{lead.name}</span>
                                  <span className="text-[10px] text-neutral-500">{lead.email}</span>
                                </div>
                              </td>
                              <td className="py-4 max-w-xs truncate text-[11px] text-neutral-400">
                                {lead.message}
                              </td>
                              <td className="py-4 text-right pr-4 rounded-r-2xl">
                                <button onClick={() => handleDelete(COLLECTION_ID_LEADS, lead.$id)} className="p-2 text-neutral-600 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {activeTab === 'users' && (
                      <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                          <tr className="text-neutral-500 text-[9px] uppercase font-black tracking-[0.2em] px-4">
                            <th className="pb-4 pl-4">Handle</th>
                            <th className="pb-4">Identity Name</th>
                            <th className="pb-4">Email Path</th>
                            <th className="pb-4">Access Level</th>
                            <th className="pb-4 text-right pr-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.$id} className="group bg-white/5 hover:bg-white/[0.08] transition-all rounded-2xl overflow-hidden">
                              <td className="py-4 pl-4 text-sm font-bold text-purple-400 rounded-l-2xl">
                                @{user.username}
                              </td>
                              <td className="py-4 text-sm text-white">
                                {user.name}
                              </td>
                              <td className="py-4 text-[11px] text-neutral-500 font-mono">
                                {user.email}
                              </td>
                              <td className="py-4">
                                <span className={cn(
                                  "text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest",
                                  user.role === 'admin' ? "bg-emerald-500 text-black" : "bg-neutral-800 text-neutral-400"
                                )}>{user.role}</span>
                              </td>
                              <td className="py-4 text-right pr-4 rounded-r-2xl">
                                <button onClick={() => handleDelete(COLLECTION_ID_PROFILES, user.$id)} className="p-2 text-neutral-600 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {activeTab === 'stats' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        {[
                          { label: "Total Leads", value: stats.totalLeads, icon: MessageSquare, color: "text-blue-400" },
                          { label: "Registered Profiles", value: stats.totalUsers, icon: Users, color: "text-purple-400" },
                          { label: "Conversion Rate", value: `${Math.round((stats.totalLeads / (stats.totalUsers || 1)) * 100)}%`, icon: ArrowUpRight, color: "text-emerald-400" }
                        ].map((s, i) => (
                          <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/5">
                            <s.icon className={cn("w-6 h-6 mb-4", s.color)} />
                            <div className="text-4xl font-bold text-white mb-2">{s.value}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{s.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}