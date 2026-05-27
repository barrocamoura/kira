"use client";

import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, Ban, CheckCircle, Search, CreditCard, Clock, Globe } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function CRODashboard() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Fetch Contracts with User data
    const { data: contractData } = await supabase
      .from('client_contracts')
      .select('*, user:users(id, full_name, email, role, status)')
      .order('mrr_value', { ascending: false });
      
    if (contractData) setContracts(contractData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalMrr = contracts.filter(c => c.status === 'active').reduce((acc, curr) => acc + Number(curr.mrr_value), 0);
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const suspendedContracts = contracts.filter(c => c.status === 'suspended').length;
  const churnRiskMrr = contracts.filter(c => c.status === 'suspended').reduce((acc, curr) => acc + Number(curr.mrr_value), 0);

  const toggleContractStatus = async (contractId: string, currentStatus: string, userId: string) => {
    const supabase = createClient();
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const newUserStatus = newStatus === 'suspended' ? 'blocked' : 'active';

    // Optimistic Update
    setContracts(contracts.map(c => c.id === contractId ? { 
      ...c, 
      status: newStatus,
      user: { ...c.user, status: newUserStatus }
    } : c));

    // DB Update
    await supabase.from('client_contracts').update({ status: newStatus }).eq('id', contractId);
    await supabase.from('users').update({ status: newUserStatus }).eq('id', userId);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-500" />
            Client Management
          </h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-bold">Office of the CRO</p>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] group-hover:bg-indigo-500/20 transition-all" />
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Secured MRR <CreditCard className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-4xl font-black text-indigo-400">€{totalMrr.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-slate-500 mt-2 font-mono">FROM ACTIVE CONTRACTS</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/20 transition-all" />
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Active Deployments <Globe className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-4xl font-black text-white">{activeContracts}</div>
          <div className="text-xs text-slate-500 mt-2 font-mono">LIVE ENVIRONMENTS</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] group-hover:bg-amber-500/20 transition-all" />
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Suspended Contracts <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-4xl font-black text-amber-400">{suspendedContracts}</div>
          <div className="text-xs text-slate-500 mt-2 font-mono">PENDING RESOLUTION</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] group-hover:bg-red-500/20 transition-all" />
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            MRR at Risk (Suspended) <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-4xl font-black text-red-400">€{churnRiskMrr.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-slate-500 mt-2 font-mono">POTENTIAL CHURN IMPACT</div>
        </div>
      </div>

      {/* CLIENT ROSTER */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden flex flex-col relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-black/40 relative z-10">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">SaaS Client Roster</h3>
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search contracts or clients..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="p-4">Client / Tenant</th>
                <th className="p-4">Plan & Billing</th>
                <th className="p-4 text-right">MRR</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500 text-xs font-mono">LOADING CONTRACTS...</td></tr>
              ) : contracts.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500 text-xs font-mono">NO CONTRACTS FOUND</td></tr>
              ) : (
                contracts.map(contract => (
                  <tr key={contract.id} className={`border-b border-slate-800/30 transition ${contract.status === 'suspended' ? 'bg-red-500/5' : 'hover:bg-white/5'}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${contract.status === 'suspended' ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-white'}`}>
                          {contract.user?.full_name?.substring(0, 2).toUpperCase() || 'NA'}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{contract.user?.full_name || 'Unknown Client'}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{contract.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-slate-300">{contract.plan_name}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{contract.billing_cycle}</div>
                    </td>
                    <td className="p-4 text-right font-black text-emerald-400">
                      €{Number(contract.mrr_value).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center">
                      {contract.status === 'active' ? (
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">Active</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">Suspended</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => toggleContractStatus(contract.id, contract.status, contract.user_id)}
                        className={`px-3 py-1.5 rounded-lg transition text-xs font-bold flex items-center gap-2 ml-auto ${contract.status === 'active' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                      >
                        {contract.status === 'active' ? (
                          <><Ban className="w-3 h-3" /> Suspend Service</>
                        ) : (
                          <><CheckCircle className="w-3 h-3" /> Restore Access</>
                        )}
                      </button>
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
