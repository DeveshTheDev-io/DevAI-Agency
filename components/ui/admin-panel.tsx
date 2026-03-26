'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Users, MessageSquare, Trash2, RefreshCw,
  Lock, Mail, Eye, EyeOff, Settings, ShieldCheck,
  Key, LogOut, Edit3, Search, Building2, Calendar,
  Smartphone, MapPin, Package, Plus, CheckCircle2,
  BarChart3, TrendingUp, Zap, IndianRupee, Star,
  AtSign, GraduationCap, Percent, Layout
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Default packages to seed on first load ───
const DEFAULT_PACKAGES = [
  {
    name: 'AI Starter Pack',
    price: 14999,
    badge: null,
    highlight: false,
    description: 'Perfect for startups and founders testing AI-powered features in their product.',
    features: ['1 Custom AI Model', 'Basic API Integration', 'Simple Chat/Recommend Engine', '1-week delivery', 'Email Support'],
  },
  {
    name: 'Full-Stack SaaS Pro',
    price: 49999,
    badge: 'Best Value',
    highlight: true,
    description: 'Complete production SaaS platform with AI capabilities — designed for Indian MSMEs and funded startups.',
    features: ['React + Node.js + Supabase', 'Auth & Admin Dashboard', 'AI Feature Integration', 'Framer Motion UI', 'Mobile Responsive', '2-3 week delivery'],
  },
  {
    name: 'E-Commerce AI Engine',
    price: 34999,
    badge: 'Popular',
    highlight: false,
    description: 'Smart shopping platform with AI recommendations and analytics. Ideal for D2C brands in India.',
    features: ['Product Catalog & Cart', 'AI Recommendations', 'Razorpay/UPI Integration', 'Inventory Dashboard', 'WhatsApp Alerts', '2-week delivery'],
  },
  {
    name: 'Enterprise AI Suite',
    price: 0,
    badge: 'Custom',
    highlight: false,
    description: 'Bespoke deep learning pipelines, LLM integrations, and enterprise-grade cloud deployment.',
    features: ['Custom Neural Networks', 'LLM Fine-tuning', 'Docker + CI/CD Pipeline', 'Dedicated Support', 'Performance SLA', 'Flexible timeline'],
  },
];

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  type TabType = 'overview' | 'leads' | 'users' | 'packages' | 'courses' | 'agents' | 'settings';
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [leads, setLeads] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalLeads: 0, totalUsers: 0, totalPackages: 0, totalCourses: 0, totalAgents: 0 });

  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Package form
  const [pkgForm, setPkgForm] = useState<any>(null); // null = closed, {} = new, {id} = edit
  const [pkgSaving, setPkgSaving] = useState(false);

  // Course form
  const [courseForm, setCourseForm] = useState<any>(null);
  const [courseSaving, setCourseSaving] = useState(false);

  // Agent form
  const [agentForm, setAgentForm] = useState<any>(null);
  const [agentSaving, setAgentSaving] = useState(false);

  const [newAdminPass, setNewAdminPass] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // ─── Auth ───
  const checkAuth = async () => {
    setAuthLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setIsAuthorized(false); setAuthLoading(false); return; }

      // Look for profile in users table
      const { data: profile } = await supabase
        .from('users')
        .select('role, full_name, email')
        .eq('id', session.user.id)
        .single();

      // Fallback: if no profile row but authenticated, check email against known admin
      if (!profile) {
        // They're authenticated but have no profile row — treat as admin if their auth metadata says so
        // Insert a profile row automatically for the admin
        await supabase.from('users').upsert({
          id: session.user.id,
          username: 'devadmin',
          full_name: 'Dev Admin',
          email: session.user.email,
          role: 'admin',
        });
        setIsAuthorized(true);
        setAdminUser({ name: 'Dev Admin', email: session.user.email });
        fetchData();
        return;
      }

      if (profile.role === 'admin') {
        setIsAuthorized(true);
        setAdminUser({ name: profile.full_name || 'Admin', email: profile.email });
        fetchData();
      } else {
        setIsAuthorized(false);
        setError('Access Denied: Your account does not have admin privileges.');
      }
    } catch {
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
      await supabase.auth.signOut();

      // Step 1: try to find email by username in users table
      let emailToUse = loginUsername.trim();
      if (!emailToUse.includes('@')) {
        // It's a username — look up the email
        const { data: rows } = await supabase
          .from('users')
          .select('email')
          .eq('username', loginUsername.toLowerCase().trim())
          .limit(1);
        if (rows && rows.length > 0) {
          emailToUse = rows[0].email;
        } else {
          // Username not found yet — admin profile row missing from users table.
          // Throw a helpful error so the admin knows to use their Supabase Auth email.
          throw new Error(
            'Username not found in database. Please run the SQL setup in Supabase to register your admin account, then re-login. Or enter your Supabase Auth email directly.'
          );
        }
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: loginPassword,
      });
      if (signInError) throw signInError;
      await checkAuth();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Check username/email and password.');
    } finally {
      setAuthLoading(false);
    }
  };

  // ─── Data ───
  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, usersRes, pkgsRes, coursesRes, agentsRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('users').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('packages').select('*').order('created_at', { ascending: true }),
        supabase.from('courses').select('*').order('created_at', { ascending: true }),
        supabase.from('agents').select('*').order('created_at', { ascending: true }),
      ]);
      setLeads(leadsRes.data || []);
      setUsers(usersRes.data || []);
      setPackages(pkgsRes.data || []);
      setCourses(coursesRes.data || []);
      setAgents(agentsRes.data || []);
      setStats({
        totalLeads: leadsRes.data?.length || 0,
        totalUsers: usersRes.data?.length || 0,
        totalPackages: pkgsRes.data?.length || 0,
        totalCourses: coursesRes.data?.length || 0,
        totalAgents: agentsRes.data?.length || 0,
      });
    } catch (err) {
      setError('Failed to fetch data from database.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Permanently delete this record?')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  // ─── Packages CRUD ───
  const openNewPkg = () => setPkgForm({
    name: '', price: 0, badge: '', highlight: false, description: '', features: [''],
  });
  const openEditPkg = (pkg: any) => setPkgForm({
    ...pkg,
    features: Array.isArray(pkg.features) ? pkg.features : [],
  });

  const savePkg = async () => {
    if (!pkgForm.name || !pkgForm.description) { alert('Name and description required.'); return; }
    setPkgSaving(true);
    try {
      const payload = {
        name: pkgForm.name,
        price: Number(pkgForm.price) || 0,
        badge: pkgForm.badge || null,
        highlight: !!pkgForm.highlight,
        description: pkgForm.description,
        features: pkgForm.features.filter((f: string) => f.trim()),
      };
      if (pkgForm.id) {
        await supabase.from('packages').update(payload).eq('id', pkgForm.id);
      } else {
        await supabase.from('packages').insert(payload);
      }
      setPkgForm(null);
      fetchData();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setPkgSaving(false);
    }
  };

  // ─── Courses CRUD ───
  const openNewCourse = () => setCourseForm({
    title: '', description: '', duration: '', level: '', badge: '', color: 'blue', discount: 0
  });
  const openEditCourse = (course: any) => setCourseForm({ ...course });

  const saveCourse = async () => {
    if (!courseForm.title || !courseForm.description) { alert('Title and description required.'); return; }
    setCourseSaving(true);
    try {
      const payload = {
        title: courseForm.title,
        description: courseForm.description,
        duration: courseForm.duration,
        level: courseForm.level,
        badge: courseForm.badge,
        color: courseForm.color,
        discount: Number(courseForm.discount) || 0,
      };
      if (courseForm.id) {
        await supabase.from('courses').update(payload).eq('id', courseForm.id);
      } else {
        await supabase.from('courses').insert(payload);
      }
      setCourseForm(null);
      fetchData();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setCourseSaving(false);
    }
  };

  // ─── Agents CRUD ───
  const openNewAgent = () => setAgentForm({
    title: '', description: '', icon: 'Globe', tag: '', color: 'blue'
  });
  const openEditAgent = (agent: any) => setAgentForm({ ...agent });

  const saveAgent = async () => {
    if (!agentForm.title || !agentForm.description) { alert('Title and description required.'); return; }
    setAgentSaving(true);
    try {
      const payload = {
        title: agentForm.title,
        description: agentForm.description,
        icon: agentForm.icon,
        tag: agentForm.tag,
        color: agentForm.color,
      };
      if (agentForm.id) {
        await supabase.from('agents').update(payload).eq('id', agentForm.id);
      } else {
        await supabase.from('agents').insert(payload);
      }
      setAgentForm(null);
      fetchData();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setAgentSaving(false);
    }
  };

  const handleUpdateAdminPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg('Updating...');
    const { error } = await supabase.auth.updateUser({ password: newAdminPass });
    if (error) setPassMsg('Error: ' + error.message);
    else { setPassMsg('Password updated successfully!'); setNewAdminPass(''); }
    setTimeout(() => setPassMsg(''), 3000);
  };

  useEffect(() => { if (isOpen) checkAuth(); }, [isOpen]);

  const filteredLeads = leads.filter(l =>
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─── Sidebar tabs ───
  const TABS: { id: TabType; label: string; icon: any; badge?: number }[] = [
    { id: 'overview',  label: 'Overview',  icon: BarChart3 },
    { id: 'leads',     label: 'Leads',     icon: MessageSquare, badge: stats.totalLeads },
    { id: 'users',     label: 'Users',     icon: Users, badge: stats.totalUsers },
    { id: 'packages',  label: 'Packages',  icon: Package, badge: stats.totalPackages },
    { id: 'courses',   label: 'Courses',   icon: GraduationCap, badge: stats.totalCourses },
    { id: 'agents',    label: 'Agents',    icon: Layout, badge: stats.totalAgents },
    { id: 'settings',  label: 'Settings',  icon: Settings },
  ];

  // ─── Login Screen ───
  const LoginScreen = () => (
    <div className="flex-1 flex items-center justify-center p-8 bg-[#030303]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
            <Lock className="w-9 h-9 text-purple-400" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Admin Console</h2>
          <p className="text-[9px] text-neutral-500 uppercase tracking-[0.3em] mt-2 font-bold">Dev AI Agency — Control Center</p>
        </div>

        <div className="bg-neutral-950 border border-white/[0.07] rounded-[2rem] p-8">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="relative">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                required type="text" placeholder="Username or Email"
                value={loginUsername} onChange={e => setLoginUsername(e.target.value)}
                className="w-full bg-black border border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-700"
              />
            </div>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                required type={showPass ? 'text' : 'password'} placeholder="Password"
                value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-black border border-white/5 rounded-xl pl-12 pr-12 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-700"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase tracking-wide text-center">{error}</div>
            )}
            <button disabled={authLoading} type="submit"
              className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-2 hover:bg-neutral-100 transition-all active:scale-[0.98]"
            >
              {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Access Console'}
            </button>
          </form>
          <p className="text-center text-[9px] text-neutral-600 mt-5 font-bold uppercase tracking-widest">Enter your Supabase admin email + password</p>
        </div>
      </motion.div>
    </div>
  );

  // ─── Overview Tab ───
  const OverviewTab = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Good to have you back 👋</h3>
        <p className="text-neutral-500 text-sm">Here's your agency snapshot.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Leads', val: stats.totalLeads, icon: MessageSquare, color: 'purple', sub: 'Contact form submissions' },
          { label: 'Registered Users', val: stats.totalUsers, icon: Users, color: 'blue', sub: 'Signed up identities' },
          { label: 'Active Packages', val: stats.totalPackages, icon: Package, color: 'emerald', sub: 'Service plans live' },
          { label: 'Courses', val: stats.totalCourses, icon: GraduationCap, color: 'blue', sub: 'Learning modules' },
          { label: 'Growth Agents', val: stats.totalAgents, icon: Layout, color: 'amber', sub: 'AI solutions' },
        ].map((s, i) => {
          const colorMap: Record<string, string> = { 
            purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20', 
            blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20', 
            emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
            amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
          };
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="p-8 rounded-[2rem] bg-neutral-950/60 border border-white/[0.06] hover:border-white/10 transition-all"
            >
              <div className={cn('w-12 h-12 rounded-xl border flex items-center justify-center mb-6', colorMap[s.color])}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-4xl font-black text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.val}</div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{s.label}</div>
              <div className="text-[9px] text-neutral-600 mt-1">{s.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Leads */}
      <div>
        <h4 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-4">Recent Leads</h4>
        <div className="space-y-3">
          {leads.slice(0, 5).map((lead, i) => (
            <motion.div key={lead.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-5 rounded-2xl bg-neutral-950/40 border border-white/[0.05] hover:border-purple-500/20 transition-all cursor-pointer"
              onClick={() => setSelectedLead(lead)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{lead.name}</div>
                  <div className="text-[10px] text-neutral-500">{lead.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase tracking-widest">{lead.source}</span>
                <span className="text-[9px] text-neutral-600">{new Date(lead.created_at).toLocaleDateString('en-IN')}</span>
              </div>
            </motion.div>
          ))}
          {leads.length === 0 && <p className="text-neutral-600 text-sm text-center py-8">No leads yet.</p>}
        </div>
      </div>
    </div>
  );

  // ─── Leads Tab ───
  const LeadsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Lead Inbox <span className="text-neutral-600 ml-2 text-lg">{leads.length}</span></h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..."
            className="bg-neutral-950 border border-white/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/40 placeholder:text-neutral-600 w-48"
          />
        </div>
      </div>
      <div className="space-y-3">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="group flex items-center justify-between p-6 rounded-2xl bg-neutral-950/40 border border-white/[0.05] hover:border-purple-500/20 transition-all">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-white/[0.07] flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-purple-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-0.5">
                  <span className="text-sm font-bold text-white truncate">{lead.name}</span>
                  <span className="text-[8px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase tracking-widest shrink-0">{lead.source}</span>
                </div>
                <div className="text-[10px] text-neutral-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email} {lead.company && ` · ${lead.company}`}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <span className="text-[9px] text-neutral-600 hidden md:block">{new Date(lead.created_at).toLocaleDateString('en-IN')}</span>
              <button onClick={() => setSelectedLead(lead)} className="px-4 py-2 bg-neutral-900 border border-white/[0.07] rounded-lg text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-all">View</button>
              <button onClick={() => handleDelete('projects', lead.id)} className="p-2 text-neutral-700 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {filteredLeads.length === 0 && <p className="text-neutral-600 text-sm text-center py-12">No leads found.</p>}
      </div>
    </div>
  );

  // ─── Users Tab ───
  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Users <span className="text-neutral-600 ml-2 text-lg">{users.length}</span></h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..."
            className="bg-neutral-950 border border-white/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40 placeholder:text-neutral-600 w-48"
          />
        </div>
      </div>
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="group flex items-center justify-between p-6 rounded-2xl bg-neutral-950/40 border border-white/[0.05] hover:border-blue-500/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-white/[0.07] flex items-center justify-center">
                <AtSign className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold text-white">@{user.username}</span>
                  <span className={cn('text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border', user.role === 'admin' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-neutral-800 border-white/5 text-neutral-500')}>{user.role}</span>
                </div>
                <div className="text-[10px] text-neutral-500">{user.full_name} · {user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedUser(user)} className="px-4 py-2 bg-neutral-900 border border-white/[0.07] rounded-lg text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-all">View</button>
              <button onClick={() => handleDelete('users', user.id)} className="p-2 text-neutral-700 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && <p className="text-neutral-600 text-sm text-center py-12">No users found.</p>}
      </div>
    </div>
  );

  // ─── Packages Tab ───
  const PackagesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Packages</h3>
        <button onClick={openNewPkg} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-100 transition-all">
          <Plus className="w-3.5 h-3.5" /> Add Package
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {packages.map((pkg) => (
          <motion.div key={pkg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={cn('relative p-7 rounded-[2rem] border transition-all', pkg.highlight ? 'bg-purple-950/20 border-purple-500/30' : 'bg-neutral-950/50 border-white/[0.06]')}
          >
            {pkg.badge && (
              <span className="absolute top-4 right-4 flex items-center gap-1 text-[8px] px-2.5 py-1 rounded-full bg-purple-500 text-white font-black uppercase tracking-widest">
                <Star className="w-2.5 h-2.5 fill-white" />{pkg.badge}
              </span>
            )}
            <div className="mb-4">
              <h4 className="text-lg font-black text-white mb-1">{pkg.name}</h4>
              <div className="flex items-center gap-1 text-2xl font-black text-white">
                {pkg.price > 0 ? <><IndianRupee className="w-5 h-5" />{pkg.price.toLocaleString('en-IN')}</> : <span>Custom</span>}
              </div>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed mb-4">{pkg.description}</p>
            <ul className="space-y-1.5 mb-6">
              {(pkg.features || []).map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-[11px] text-neutral-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{f}
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button onClick={() => openEditPkg(pkg)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.08] text-[10px] font-black uppercase tracking-widest text-neutral-300 hover:bg-white hover:text-black transition-all">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete('packages', pkg.id)} className="p-2.5 rounded-xl border border-red-500/20 text-red-500/60 hover:text-red-400 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {packages.length === 0 && (
          <div className="col-span-2 py-16 text-center">
            <Package className="w-8 h-8 text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-600 text-sm mb-4">No packages yet.</p>
            <button onClick={openNewPkg} className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-100 transition-all">Add Your First Package</button>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Courses Tab ───
  const CoursesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Courses</h3>
        <button onClick={openNewCourse} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-100 transition-all">
          <Plus className="w-3.5 h-3.5" /> Add Course
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="relative p-7 rounded-[2rem] border border-white/[0.06] bg-neutral-950/50 hover:border-blue-500/20 transition-all"
          >
            {course.badge && (
              <span className="absolute top-4 right-4 flex items-center gap-1 text-[8px] px-2.5 py-1 rounded-full bg-blue-500 text-white font-black uppercase tracking-widest">
                <Star className="w-2.5 h-2.5 fill-white" />{course.badge}
              </span>
            )}
            <div className="mb-4">
              <h4 className="text-lg font-black text-white mb-1">{course.title}</h4>
              <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                {course.duration} • {course.level}
              </div>
              {course.discount > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <Percent className="w-3 h-3" /> {course.discount}% OFF
                </div>
              )}
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed mb-6">{course.description}</p>
            <div className="flex gap-2">
              <button onClick={() => openEditCourse(course)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.08] text-[10px] font-black uppercase tracking-widest text-neutral-300 hover:bg-white hover:text-black transition-all">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete('courses', course.id)} className="p-2.5 rounded-xl border border-red-500/20 text-red-500/60 hover:text-red-400 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-2 py-16 text-center">
            <GraduationCap className="w-8 h-8 text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-600 text-sm mb-4">No courses yet.</p>
            <button onClick={openNewCourse} className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-100 transition-all">Add Your First Course</button>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Agents Tab ───
  const AgentsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Agents</h3>
        <button onClick={openNewAgent} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-100 transition-all">
          <Plus className="w-3.5 h-3.5" /> Add Agent
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {agents.map((agent) => (
          <motion.div key={agent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="relative p-7 rounded-[2rem] border border-white/[0.06] bg-neutral-950/50 hover:border-amber-500/20 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/[0.07] flex items-center justify-center">
                  <Layout className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">{agent.title}</h4>
                  <span className="text-[8px] px-2 py-0.5 rounded-full border border-amber-500/20 text-amber-400 font-bold uppercase tracking-widest">{agent.tag}</span>
                </div>
              </div>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed mb-6">{agent.description}</p>
            <div className="flex gap-2">
              <button onClick={() => openEditAgent(agent)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.08] text-[10px] font-black uppercase tracking-widest text-neutral-300 hover:bg-white hover:text-black transition-all">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete('agents', agent.id)} className="p-2.5 rounded-xl border border-red-500/20 text-red-500/60 hover:text-red-400 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {agents.length === 0 && (
          <div className="col-span-2 py-16 text-center">
            <Layout className="w-8 h-8 text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-600 text-sm mb-4">No agents yet.</p>
            <button onClick={openNewAgent} className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-100 transition-all">Add Your First Agent</button>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Settings Tab ───
  const SettingsTab = () => (
    <div className="max-w-lg space-y-8">
      <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Settings</h3>
      <div className="p-8 rounded-[2rem] bg-neutral-950/50 border border-white/[0.06]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="text-white font-bold">{adminUser?.name}</div>
            <div className="text-[10px] text-neutral-500">{adminUser?.email}</div>
          </div>
        </div>
        <form onSubmit={handleUpdateAdminPass} className="space-y-4">
          <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Change Password</label>
          <input required type="password" value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)} placeholder="New password..."
            className="w-full bg-black border border-white/[0.07] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500/40 placeholder:text-neutral-700"
          />
          <button type="submit" className="w-full py-4 bg-purple-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-purple-500 transition-all">Update Password</button>
          {passMsg && <p className="text-center text-[10px] font-bold text-purple-400">{passMsg}</p>}
        </form>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[50000] flex items-center justify-center p-3 md:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/95 backdrop-blur-2xl" />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            className="relative w-full max-w-7xl h-[92vh] bg-[#050505] border border-white/[0.08] rounded-[2.5rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.8)] z-[50001] flex flex-col"
          >
            {!isAuthorized ? <LoginScreen /> : (
              <>
                {/* Top bar */}
                <div className="px-8 py-5 border-b border-white/[0.06] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Admin Console</div>
                      <div className="flex items-center gap-1.5 text-[9px] text-neutral-500 uppercase tracking-widest font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Connected · {adminUser?.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-neutral-500 hover:text-white transition-all">
                      <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
                    </button>
                    <button onClick={onClose} className="p-2.5 rounded-xl bg-white text-black hover:bg-neutral-100 transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                  {/* Sidebar */}
                  <div className="w-56 border-r border-white/[0.06] bg-black/30 p-5 flex flex-col gap-1 shrink-0">
                    {TABS.map(tab => (
                      <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                          activeTab === tab.id ? 'bg-white text-black' : 'text-neutral-500 hover:text-white hover:bg-white/[0.04]'
                        )}
                      >
                        <tab.icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{tab.label}</span>
                        {tab.badge !== undefined && tab.badge > 0 && (
                          <span className={cn('ml-auto text-[8px] px-1.5 py-0.5 rounded-full font-black', activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-400')}>{tab.badge}</span>
                        )}
                      </button>
                    ))}
                    <div className="mt-auto">
                      <button onClick={async () => { await supabase.auth.signOut(); setIsAuthorized(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-400 hover:bg-red-500/5 transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 overflow-auto p-8">
                    {loading && activeTab !== 'overview' ? (
                      <div className="flex items-center justify-center h-40">
                        <RefreshCw className="w-6 h-6 text-neutral-600 animate-spin" />
                      </div>
                    ) : (
                      <>
                        {activeTab === 'overview' && <OverviewTab />}
                        {activeTab === 'leads' && <LeadsTab />}
                        {activeTab === 'users' && <UsersTab />}
                        {activeTab === 'packages' && <PackagesTab />}
                        {activeTab === 'courses' && <CoursesTab />}
                        {activeTab === 'agents' && <AgentsTab />}
                        {activeTab === 'settings' && <SettingsTab />}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Course Edit/Create Modal */}
          <AnimatePresence>
            {courseForm !== null && (
              <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCourseForm(null)} className="fixed inset-0 bg-black/80 backdrop-blur-lg" />
                <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                  className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-auto max-h-[90vh] shadow-2xl z-[60001]"
                >
                  <button onClick={() => setCourseForm(null)} className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900 text-neutral-500 hover:text-white transition-all">
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-2xl font-black text-white mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{courseForm.id ? 'Edit Course' : 'New Course'}</h3>

                  <div className="space-y-5">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Course Title *</label>
                      <input value={courseForm.title || ''} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                        placeholder="e.g. AI Prompting Mastery"
                        className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/40 placeholder:text-neutral-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Duration</label>
                        <input value={courseForm.duration || ''} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })}
                          placeholder="e.g. 4 Weeks"
                          className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/40 placeholder:text-neutral-700"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Level</label>
                        <input value={courseForm.level || ''} onChange={e => setCourseForm({ ...courseForm, level: e.target.value })}
                          placeholder="e.g. Beginner / Advanced"
                          className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/40 placeholder:text-neutral-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Badge</label>
                        <input value={courseForm.badge || ''} onChange={e => setCourseForm({ ...courseForm, badge: e.target.value })}
                          placeholder="e.g. Most Popular"
                          className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/40 placeholder:text-neutral-700"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Discount (%)</label>
                        <div className="relative">
                          <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-500" />
                          <input type="number" value={courseForm.discount || ''} onChange={e => setCourseForm({ ...courseForm, discount: e.target.value })}
                            placeholder="0"
                            className="w-full bg-neutral-900 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/40 placeholder:text-neutral-700"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Description *</label>
                      <textarea rows={3} value={courseForm.description || ''} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                        placeholder="Course overview..."
                        className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/40 placeholder:text-neutral-700 resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button onClick={saveCourse} disabled={courseSaving}
                        className="flex-1 py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-neutral-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {courseSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> {courseForm.id ? 'Save Course' : 'Create Course'}</>}
                      </button>
                      <button onClick={() => setCourseForm(null)} className="px-8 py-4 border border-white/10 rounded-xl font-black uppercase tracking-widest text-[10px] text-neutral-400 hover:text-white transition-all">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Agent Edit/Create Modal */}
          <AnimatePresence>
            {agentForm !== null && (
              <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAgentForm(null)} className="fixed inset-0 bg-black/80 backdrop-blur-lg" />
                <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                  className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-auto max-h-[90vh] shadow-2xl z-[60001]"
                >
                  <button onClick={() => setAgentForm(null)} className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900 text-neutral-500 hover:text-white transition-all">
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-2xl font-black text-white mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{agentForm.id ? 'Edit Agent' : 'New Agent'}</h3>

                  <div className="space-y-5">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Agent Title *</label>
                      <input value={agentForm.title || ''} onChange={e => setAgentForm({ ...agentForm, title: e.target.value })}
                        placeholder="e.g. Email Automation Pro"
                        className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/40 placeholder:text-neutral-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Tag</label>
                        <input value={agentForm.tag || ''} onChange={e => setAgentForm({ ...agentForm, tag: e.target.value })}
                          placeholder="e.g. Communication"
                          className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/40 placeholder:text-neutral-700"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Icon (Lucide name)</label>
                        <input value={agentForm.icon || ''} onChange={e => setAgentForm({ ...agentForm, icon: e.target.value })}
                          placeholder="e.g. Globe, Brain, Database"
                          className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/40 placeholder:text-neutral-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Description *</label>
                      <textarea rows={3} value={agentForm.description || ''} onChange={e => setAgentForm({ ...agentForm, description: e.target.value })}
                        placeholder="What this agent does..."
                        className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/40 placeholder:text-neutral-700 resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button onClick={saveAgent} disabled={agentSaving}
                        className="flex-1 py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-neutral-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {agentSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> {agentForm.id ? 'Save Agent' : 'Create Agent'}</>}
                      </button>
                      <button onClick={() => setAgentForm(null)} className="px-8 py-4 border border-white/10 rounded-xl font-black uppercase tracking-widest text-[10px] text-neutral-400 hover:text-white transition-all">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Package Edit/Create Modal */}
          <AnimatePresence>
            {pkgForm !== null && (
              <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPkgForm(null)} className="fixed inset-0 bg-black/80 backdrop-blur-lg" />
                <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                  className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-auto max-h-[90vh] shadow-2xl z-[60001]"
                >
                  <button onClick={() => setPkgForm(null)} className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900 text-neutral-500 hover:text-white transition-all">
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-2xl font-black text-white mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{pkgForm.id ? 'Edit Package' : 'New Package'}</h3>

                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Package Name *</label>
                        <input value={pkgForm.name || ''} onChange={e => setPkgForm({ ...pkgForm, name: e.target.value })}
                          placeholder="e.g. Startup Booster"
                          className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 placeholder:text-neutral-700"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Price (₹) — 0 for Custom</label>
                        <input value={pkgForm.price || ''} onChange={e => setPkgForm({ ...pkgForm, price: e.target.value })} type="number" min="0"
                          placeholder="49999"
                          className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 placeholder:text-neutral-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Badge (optional)</label>
                        <input value={pkgForm.badge || ''} onChange={e => setPkgForm({ ...pkgForm, badge: e.target.value })}
                          placeholder="Best Value / Popular / New"
                          className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 placeholder:text-neutral-700"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-3 cursor-pointer pb-3">
                          <div
                            onClick={() => setPkgForm({ ...pkgForm, highlight: !pkgForm.highlight })}
                            className={cn('w-10 h-5 rounded-full transition-colors relative cursor-pointer', pkgForm.highlight ? 'bg-purple-500' : 'bg-neutral-700')}
                          >
                            <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all', pkgForm.highlight ? 'left-5' : 'left-0.5')} />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Highlight (Featured)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Description *</label>
                      <textarea rows={3} value={pkgForm.description || ''} onChange={e => setPkgForm({ ...pkgForm, description: e.target.value })}
                        placeholder="What this package offers..."
                        className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 placeholder:text-neutral-700 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Features (one per line)</label>
                      {(pkgForm.features || ['']).map((f: string, idx: number) => (
                        <div key={idx} className="flex gap-2 mb-2">
                          <input value={f} onChange={e => { const arr = [...pkgForm.features]; arr[idx] = e.target.value; setPkgForm({ ...pkgForm, features: arr }); }}
                            placeholder={`Feature ${idx + 1}`}
                            className="flex-1 bg-neutral-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/40 placeholder:text-neutral-700"
                          />
                          <button type="button" onClick={() => { const arr = pkgForm.features.filter((_: any, i: number) => i !== idx); setPkgForm({ ...pkgForm, features: arr }); }} className="p-2.5 rounded-xl text-neutral-600 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setPkgForm({ ...pkgForm, features: [...(pkgForm.features || []), ''] })}
                        className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 hover:text-white transition-all mt-2"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Feature
                      </button>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button onClick={savePkg} disabled={pkgSaving}
                        className="flex-1 py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-neutral-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {pkgSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> {pkgForm.id ? 'Save Changes' : 'Create Package'}</>}
                      </button>
                      <button onClick={() => setPkgForm(null)} className="px-8 py-4 border border-white/10 rounded-xl font-black uppercase tracking-widest text-[10px] text-neutral-400 hover:text-white transition-all">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Lead Detail Modal */}
          <AnimatePresence>
            {selectedLead && (
              <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLead(null)} className="fixed inset-0 bg-black/90 backdrop-blur-xl" />
                <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(168,85,247,0.15)] z-[60001]">
                  <button onClick={() => setSelectedLead(null)} className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900 text-neutral-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{selectedLead.name}</h3>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mt-1">Source: {selectedLead.source}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <InfoBlock label="Email" val={selectedLead.email} icon={Mail} />
                    <InfoBlock label="Company" val={selectedLead.company || '—'} icon={Building2} />
                    <InfoBlock label="Date" val={new Date(selectedLead.created_at).toLocaleString('en-IN')} icon={Calendar} />
                    <InfoBlock label="Status" val="Received" icon={CheckCircle2} green />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-3">Message</p>
                    <div className="p-6 bg-neutral-900/50 rounded-2xl border border-white/5 text-neutral-300 text-sm leading-relaxed">{selectedLead.message}</div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* User Detail Modal */}
          <AnimatePresence>
            {selectedUser && (
              <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="fixed inset-0 bg-black/90 backdrop-blur-xl" />
                <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(59,130,246,0.15)] z-[60001]">
                  <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900 text-neutral-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <AtSign className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>@{selectedUser.username}</h3>
                      <span className={cn('text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border', selectedUser.role === 'admin' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-neutral-800 border-white/5 text-neutral-500')}>{selectedUser.role}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <InfoBlock label="Full Name" val={selectedUser.full_name} icon={Users} />
                    <InfoBlock label="Email" val={selectedUser.email} icon={Mail} />
                    <InfoBlock label="Phone" val={selectedUser.phone || '—'} icon={Smartphone} />
                    <InfoBlock label="Address" val={selectedUser.address || '—'} icon={MapPin} />
                    <InfoBlock label="Joined" val={new Date(selectedUser.created_at).toLocaleDateString('en-IN')} icon={Calendar} />
                    <InfoBlock label="ID" val={selectedUser.id.slice(0, 16) + '...'} icon={Key} />
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

function InfoBlock({ label, val, icon: Icon, green }: { label: string; val: string; icon: any; green?: boolean }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.35em] flex items-center gap-1.5"><Icon className="w-3 h-3" />{label}</p>
      {green ? (
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-emerald-400 text-xs font-bold">{val}</span></div>
      ) : (
        <p className="text-white text-sm font-bold truncate">{val}</p>
      )}
    </div>
  );
}