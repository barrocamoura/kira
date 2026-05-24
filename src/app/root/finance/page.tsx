"use client";

import React, { useEffect, useState } from 'react';
import { LineChart as ChartLine, DollarSign, Wallet, FileText, ArrowUpRight, TrendingDown } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function CFODashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ revenue: 0, pending: 0 });

  const fetchFinance = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Fetch Latest Transactions
    const { data: latestTx } = await supabase
      .from('transactions')
      .select('*, user:users(full_name, role)')
      .order('created_at', { ascending: false });
      
    if (latestTx) {
      setTransactions(latestTx);
      
      const revenue = latestTx.filter(t => t.status === 'paid').reduce((a, b) => a + Number(b.amount), 0);
      const pending = latestTx.filter(t => t.status === 'pending').reduce((a, b) => a + Number(b.amount), 0);
      
      setKpis({ revenue, pending });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-3">
            <ChartLine className="w-8 h-8 text-emerald-500" />
            Financial Hub
          </h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-bold">Office of the CFO</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-3xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
            <DollarSign className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-1">Total Revenue Collected</div>
          <div className="text-4xl font-black text-emerald-400">€{kpis.revenue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-3xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
            <Wallet className="w-6 h-6 text-amber-400" />
          </div>
          <div className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-1">Pending Invoices</div>
          <div className="text-4xl font-black text-amber-400">€{kpis.pending.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-1">Quick Actions</div>
            <p className="text-xs text-slate-500">Manual accounting entries</p>
          </div>
          <button className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" /> Generate Invoice
          </button>
        </div>
      </div>

      {/* LEDGER */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] rounded-full pointer-events-none" />
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">General Ledger (All Transactions)</h3>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="pb-4">Timestamp</th>
                <th className="pb-4">Client</th>
                <th className="pb-4">Description</th>
                <th className="pb-4 text-right">Amount</th>
                <th className="pb-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500 font-mono text-xs">QUERYING LEDGER...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500 font-mono text-xs">NO TRANSACTIONS FOUND</td></tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-slate-800/30 hover:bg-white/5 transition">
                    <td className="py-4 text-slate-400 font-mono text-xs">{new Date(tx.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-4 font-bold text-white">{tx.user?.full_name || 'Desconhecido'}</td>
                    <td className="py-4 text-slate-400">{tx.description}</td>
                    <td className="py-4 font-black text-emerald-400 text-right">€{Number(tx.amount).toFixed(2)}</td>
                    <td className="py-4 text-center">
                      {tx.status === 'paid' ? (
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">Paid</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">{tx.status}</span>
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
