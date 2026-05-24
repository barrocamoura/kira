"use client";

import React, { useEffect, useState } from 'react';
import { DollarSign, Users, Activity, TrendingUp } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function RootDashboard() {
  const [stats, setStats] = useState({ users: 0, spaces: 0, devices: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      
      const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: spacesCount } = await supabase.from('spaces').select('*', { count: 'exact', head: true });
      const { count: devicesCount } = await supabase.from('devices').select('*', { count: 'exact', head: true });
      
      setStats({
        users: usersCount || 0,
        spaces: spacesCount || 0,
        devices: devicesCount || 0
      });
    };
    
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white">Financial Hub</h2>
        <p className="text-slate-400 mt-1">Visão global da operação B2B e B2C.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-black border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="text-sm text-slate-400 font-semibold mb-1">MRR (Receita Estimada)</div>
          <div className="text-3xl font-black text-white">€{(stats.users * 29).toLocaleString()}</div>
          <div className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Baseado em €29/mês por utilizador
          </div>
        </div>

        <div className="bg-black border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-sm text-slate-400 font-semibold mb-1">Total de Clientes</div>
          <div className="text-3xl font-black text-white">{stats.users}</div>
          <div className="text-xs text-blue-500 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Contas Ativas
          </div>
        </div>
        
        <div className="bg-black border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-sm text-slate-400 font-semibold mb-1">Espaços & Tenants</div>
          <div className="text-3xl font-black text-white">{stats.spaces}</div>
          <div className="text-xs text-purple-500 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Instâncias Criadas
          </div>
        </div>

        <div className="bg-black border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-sm text-slate-400 font-semibold mb-1">Dispositivos IoT</div>
          <div className="text-3xl font-black text-white">{stats.devices}</div>
          <div className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
            Conectados
          </div>
        </div>
      </div>

      <div className="bg-black border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
        <h3 className="text-xl font-bold text-white mb-6">Últimas Transações Stripe (Mock)</h3>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-sm text-slate-400">
                <th className="pb-3 font-semibold">Cliente</th>
                <th className="pb-3 font-semibold">Plano</th>
                <th className="pb-3 font-semibold">Data</th>
                <th className="pb-3 font-semibold">Valor</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-800/50 hover:bg-white/5 transition">
                <td className="py-4 font-medium text-white">SmartSolutions (Integrador)</td>
                <td className="py-4 text-slate-400">Enterprise</td>
                <td className="py-4 text-slate-400">Hoje, 14:30</td>
                <td className="py-4 font-bold text-emerald-400">€299.00</td>
                <td className="py-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md text-xs font-bold">Pago</span></td>
              </tr>
              <tr className="hover:bg-white/5 transition">
                <td className="py-4 font-medium text-white">Novo Cliente (Aura OS)</td>
                <td className="py-4 text-slate-400">Home Pro</td>
                <td className="py-4 text-slate-400">Ontem, 22:40</td>
                <td className="py-4 font-bold text-emerald-400">€29.00</td>
                <td className="py-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md text-xs font-bold">Pago</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
