import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Cpu, Database, Network } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AgentTerminalProps {
  agent: any;
  onClose: () => void;
  onAcquire: () => void;
}

export function AgentTerminal({ agent, onClose, onAcquire }: AgentTerminalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [bootPhase, setBootPhase] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  
  const endOfMessagesRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    // Simulate boot sequence
    const bootSequence = [
      `[SYS] Allocating VRAM for ${agent.name}...`,
      `[CPU] Loading core heuristics... OK`,
      `[NET] Connecting to OpenClaw Node... ESTABLISHED`,
      `[DATA] Loading division protocols: ${agent.division}...`,
      `[INFO] Tools loaded. Agent is ready for commands.`,
    ];

    let currentPhase = 0;
    const interval = setInterval(() => {
      if (currentPhase < bootSequence.length) {
        setLogs(prev => [...prev, bootSequence[currentPhase]]);
        currentPhase++;
        setBootPhase(currentPhase);
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [agent]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userCmd = inputValue.trim();
    setInputValue("");
    setLogs(prev => [...prev, `[USER] ${userCmd}`]);
    
    const newHistory = [...chatHistory, { role: "user", content: userCmd }];
    setChatHistory(newHistory);
    setIsTyping(true);

    try {
      const response = await fetch("https://api.bluesminds.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer sk-dmbmAwRTrY5av9SIFhN3LGn1fmdvu1KmdeeZiTOfyIs0KwOc"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are an AI agent named ${agent.name}, working in the ${agent.division} division. You are operating from a terminal console. Keep your responses concise, professional, and roleplay as this AI agent.`
            },
            ...newHistory
          ]
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        const reply = data.choices[0].message.content;
        setLogs(prev => [...prev, `[AGENT] ${reply}`]);
        setChatHistory(prev => [...prev, { role: "assistant", content: reply }]);
      } else {
        setLogs(prev => [...prev, `[ERROR] Invalid response from node.`]);
      }
    } catch (error) {
      setLogs(prev => [...prev, `[ERROR] Connection failed. Check API key or network.`]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{ height: '600px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-neutral-900/50">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono text-neutral-400">root@devscosmic-node ~ {agent.name.toLowerCase().replace(/\s+/g, '-')}</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Stats */}
            <div className="w-64 border-r border-white/10 p-6 bg-neutral-950/50 flex flex-col hidden sm:flex">
              <h3 className="text-white font-bold mb-1">{agent.name}</h3>
              <p className="text-xs text-neutral-500 mb-6">{agent.division}</p>

              <div className="space-y-4 flex-1">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU Load</span>
                    <span>{bootPhase === 5 ? '12%' : '89%'}</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-purple-500" 
                      initial={{ width: 0 }} 
                      animate={{ width: bootPhase === 5 ? '12%' : '89%' }} 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span className="flex items-center gap-1"><Database className="w-3 h-3" /> Mem Alloc</span>
                    <span>4.2 GB</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500" 
                      initial={{ width: 0 }} 
                      animate={{ width: '45%' }} 
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span className="flex items-center gap-1"><Network className="w-3 h-3" /> Latency</span>
                    <span>12ms</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500" 
                      initial={{ width: 0 }} 
                      animate={{ width: '5%' }} 
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  onAcquire();
                }}
                className="w-full mt-4 py-3 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.15)]"
              >
                Acquire Agent
              </button>
            </div>

            {/* Terminal output */}
            <div className="flex-1 p-6 bg-black font-mono text-sm overflow-y-auto flex flex-col">
              <div className="flex flex-col gap-2 mb-4">
                {logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex items-start gap-2",
                      log?.startsWith('[SYS]') ? 'text-blue-400' :
                      log?.startsWith('[CPU]') ? 'text-purple-400' :
                      log?.startsWith('[NET]') ? 'text-emerald-400' :
                      log?.startsWith('[DATA]') ? 'text-orange-400' :
                      log?.startsWith('[USER]') ? 'text-white' :
                      log?.startsWith('[AGENT]') ? 'text-green-400' :
                      log?.startsWith('[ERROR]') ? 'text-red-400' :
                      'text-green-400 font-bold'
                    )}
                  >
                    <span className="text-neutral-600 select-none shrink-0">{'>'}</span>
                    <span className="break-words whitespace-pre-wrap">{log ? log.replace(/\[.*?\]\s/, '') : ''}</span>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex items-start gap-2 text-green-400">
                    <span className="text-neutral-600 select-none shrink-0">{'>'}</span>
                    <span className="animate-pulse">Agent is processing...</span>
                  </div>
                )}
                <div ref={endOfMessagesRef} />
              </div>

              {bootPhase === 5 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-auto pt-4 border-t border-white/10"
                >
                  <form onSubmit={handleCommandSubmit} className="flex items-center gap-2">
                    <span className="text-purple-500 shrink-0">➜</span>
                    <input 
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter command or message..."
                      className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm placeholder-neutral-600 focus:ring-0 p-0"
                      autoFocus
                      disabled={isTyping}
                    />
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
