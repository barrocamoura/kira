"use client";

import React, { useEffect, useState } from 'react';
import { DollarSign, Users, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function RootDashboard() {
  const [stats, setStats] = useState({ 
    users: 0, 
    spaces: 0, 
    devices: 0,
    mrr: 0,
    churn: 0
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();
      
      const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: spacesCount } = await supabase.from('spaces').select('*', { count: 'exact', head: true });
      const { count: devicesCount } = await supabase.from('devices').select('*', { count: 'exact', head: true });
      
      // Calculate real MRR from paid transactions (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: txData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'paid')
        .gte('created_at', thirtyDaysAgo.toISOString());
        
      const calculatedMrr = txData ? txData.reduce((acc, curr) => acc + Number(curr.amount), 0) : 0;
      
      // Churn (Utilizadores bloqueados / total)
      const { count: blockedCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'blocked');
      const churnRate = usersCount && usersCount > 0 ? ((blockedCount || 0) / usersCount) * 100 : 0;

      setStats({
        users: usersCount || 0,
        spaces: spacesCount || 0,
        devices: devicesCount || 0,
        mrr: calculatedMrr,
        churn: churnRate
      });

      // Fetch Latest Transactions
      const { data: latestTx } = await supabase
        .from('transactions')
        .select('*, user:users(full_name, role)')
        .order('created_at', { ascending: false })
        .limit(10);
        
      setTransactions(latestTx || []);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white">Financial Hub</h2>
        <p className="text-slate-400 mt-1">Gestão executiva e telemetria financeira em tempo real.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-black border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="text-sm text-slate-400 font-semibold mb-1">MRR (Mês Corrente)</div>
          <div className="text-3xl font-black text-white">€{stats.mrr.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Baseado em Transações Pagas
          </div>
        </div>

        <div className="bg-black border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-sm text-slate-400 font-semibold mb-1">Contas Registadas</div>
          <div className="text-3xl font-black text-white">{stats.users}</div>
          <div className="text-xs text-blue-500 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Total na Base de Dados
          </div>
        </div>
        
        <div className="bg-black border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-sm text-slate-400 font-semibold mb-1">Churn Rate</div>
          <div className="text-3xl font-black text-white">{stats.churn.toFixed(1)}%</div>
          <div className="text-xs text-red-500 font-bold mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Clientes Bloqueados / Suspensos
          </div>
        </div>

        <div className="bg-black border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-sm text-slate-400 font-semibold mb-1">Telemetria (Espaços)</div>
          <div className="text-3xl font-black text-white">{stats.spaces}</div>
          <div className="text-xs text-purple-500 font-bold mt-2 flex items-center gap-1">
            {stats.devices} Dispositivos Ligados
          </div>
        </div>
      </div>

      <div className="bg-black border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
        <h3 className="text-xl font-bold text-white mb-6">Transações Registadas</h3>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-sm text-slate-400">
                <th className="pb-3 font-semibold">Data</th>
                <th className="pb-3 font-semibold">Cliente</th>
                <th className="pb-3 font-semibold">Role do Cliente</th>
                <th className="pb-3 font-semibold">Descrição</th>
                <th className="pb-3 font-semibold">Valor</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500">A processar dados financeiros...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500">Nenhuma transação registada no sistema ainda.</td></tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-white/5 transition">
                    <td className="py-4 text-slate-400">{new Date(tx.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-4 font-medium text-white">{tx.user?.full_name || 'Desconhecido'}</td>
                    <td className="py-4 text-slate-500 uppercase text-[10px] tracking-widest">{tx.user?.role || 'CLIENT'}</td>
                    <td className="py-4 text-slate-400">{tx.description}</td>
                    <td className="py-4 font-bold text-emerald-400">€{Number(tx.amount).toFixed(2)}</td>
                    <td className="py-4">
                      {tx.status === 'paid' ? (
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md text-xs font-bold uppercase">Pago</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md text-xs font-bold uppercase">{tx.status}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
