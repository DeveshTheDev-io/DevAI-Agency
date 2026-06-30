'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Users, DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';

export function RoiCalculator() {
  const [employees, setEmployees] = useState(5);
  const [monthlySalary, setMonthlySalary] = useState(40000);

  // Calculations
  const humanAnnualCost = employees * monthlySalary * 12;
  const aiAnnualCost = 250000 + (employees * 15000); // Fixed base + scaling compute
  const annualSavings = humanAnnualCost - aiAnnualCost;
  const efficiencyMultiplier = (humanAnnualCost / aiAnnualCost).toFixed(1);

  return (
    <section className="py-24 px-5 sm:px-10 lg:px-20 max-w-[1920px] mx-auto relative z-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
            The Cost of <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Inefficiency</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Calculate exactly how much capital you're burning on traditional human labor, and see the immediate ROI of replacing it with Devscosmic A.I.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <div className="bg-neutral-950/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Calculator className="w-32 h-32 text-purple-500" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              Your Current Workforce
            </h3>

            <div className="space-y-10 relative z-10">
              {/* Employee Slider */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
                    Traditional Employees
                  </label>
                  <span className="text-3xl font-black text-white">{employees}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={employees} 
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between mt-2 text-xs text-neutral-500 font-mono">
                  <span>1</span>
                  <span>50+</span>
                </div>
              </div>

              {/* Salary Slider */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
                    Avg Monthly Salary (₹)
                  </label>
                  <span className="text-3xl font-black text-white">
                    ₹{monthlySalary.toLocaleString('en-IN')}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="15000" 
                  max="200000" 
                  step="5000"
                  value={monthlySalary} 
                  onChange={(e) => setMonthlySalary(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between mt-2 text-xs text-neutral-500 font-mono">
                  <span>₹15k</span>
                  <span>₹200k</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 lg:p-12 shadow-[0_0_50px_rgba(168,85,247,0.1)] relative flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                Projected Savings
              </h3>

              <div className="space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-white/5">
                  <span className="text-neutral-400">Human Cost (Annual)</span>
                  <span className="text-xl text-red-400 font-mono line-through">
                    ₹{humanAnnualCost.toLocaleString('en-IN')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-6 border-b border-white/5">
                  <span className="text-neutral-400">Devscosmic A.I Cost (Annual)</span>
                  <span className="text-xl text-emerald-400 font-mono font-bold">
                    ₹{aiAnnualCost.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-purple-500/20">
              <div className="mb-2 text-sm text-purple-300 font-bold uppercase tracking-widest">
                Net Annual Savings
              </div>
              <motion.div 
                key={annualSavings}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4"
              >
                ₹{annualSavings.toLocaleString('en-IN')}
              </motion.div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                <span className="text-neutral-400">Efficiency Multiplier:</span>
                <span className="text-white font-bold">{efficiencyMultiplier}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
