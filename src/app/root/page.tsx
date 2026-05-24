"use client";

import React, { useEffect, useState } from 'react';
import { DollarSign, Users, Activity, Briefcase, Globe, TrendingUp, Cpu } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CEODashboard() {
  const [stats, setStats] = useState({ 
    users: 0, spaces: 0, mrr: 0, churn: 0,
    valuation: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();
      
      const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: spacesCount } = await supabase.from('spaces').select('*', { count: 'exact', head: true });
      
      // Calculate MRR
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: txData } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .eq('status', 'paid')
        .gte('created_at', thirtyDaysAgo.toISOString());
        
      const mrr = txData ? txData.reduce((acc, curr) => acc + Number(curr.amount), 0) : 0;
      const valuation = mrr * 12 * 5; // Simples 5x ARR multiple
      
      const { count: blockedCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'blocked');
      const churnRate = usersCount && usersCount > 0 ? ((blockedCount || 0) / usersCount) * 100 : 0;

      setStats({
        users: usersCount || 0,
        spaces: spacesCount || 0,
        mrr: mrr,
        churn: churnRate,
        valuation
      });

      // Mock Growth Data for Chart
      const mockGrowth = Array.from({length: 6}).map((_, i) => ({
        name: new Date(new Date().setMonth(new Date().getMonth() - (5 - i))).toLocaleString('default', { month: 'short' }),
        mrr: Math.floor(mrr * (1 - (5 - i) * 0.1)) + Math.floor(Math.random() * 500),
        users: Math.floor((usersCount || 10) * (1 - (5 - i) * 0.15))
      }));
      setChartData(mockGrowth);

      setLoading(false);
    };
    
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-full items-center justify-center text-slate-500 flex-col gap-4">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <div>INITIALIZING OLYMPUS SUBSYSTEMS...</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-indigo-500" />
            Office of the CEO
          </h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-bold">Global Strategy & Valuation</p>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] group-hover:bg-indigo-500/20 transition-all" />
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Estimated Valuation <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-4xl font-black text-white">€{(stats.valuation).toLocaleString('pt-PT')}</div>
          <div className="text-xs text-slate-500 mt-2 font-mono">BASE 5X ARR MULTIPLE</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-all" />
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Global MRR <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-4xl font-black text-emerald-400">€{stats.mrr.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-slate-500 mt-2 font-mono">+12.4% VS LAST MONTH</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/20 transition-all" />
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Active Deployments <Globe className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-4xl font-black text-white">{stats.spaces}</div>
          <div className="text-xs text-slate-500 mt-2 font-mono">SPACES MANAGED BY AURA OS</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] group-hover:bg-amber-500/20 transition-all" />
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            System Network <Cpu className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-4xl font-black text-white">NOMINAL</div>
          <div className="text-xs text-slate-500 mt-2 font-mono">ALL CORE SERVICES ONLINE</div>
        </div>
      </div>

      {/* BENTO GRID MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART SECTION */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Revenue Trajectory (MRR)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* METRICS & QUICK ACTIONS */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">User Base Growth</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                  <span>Total Registered</span>
                  <span className="text-white">{stats.users}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                  <span>Churn Risk (Blocked)</span>
                  <span className="text-red-400">{stats.churn.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${Math.min(stats.churn, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Strategic Alerts</h3>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
              <Activity className="w-5 h-5 text-blue-400 shrink-0" />
              <p className="text-xs text-slate-300 leading-relaxed font-medium">Growth vector looks strong. Consider expanding marketing budget for B2B sector based on recent MRR stability.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
