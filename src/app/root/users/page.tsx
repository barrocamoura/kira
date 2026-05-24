"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Users, Search, ShieldAlert, CheckCircle, Ban, ArrowUpRight } from 'lucide-react';

export default function RootUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchUsers = async () => {
    setLoading(true);
    // Fetch users with their spaces
    const { data: usersData, error } = await supabase
      .from('users')
      .select('*, spaces(id, name, plan_type)')
      .order('created_at', { ascending: false });

    if (!error && usersData) {
      setUsers(usersData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    
    // Optimistic UI Update
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    
    const { error } = await supabase
      .from('users')
      .update({ status: newStatus })
      .eq('id', userId);

    if (error) {
      alert(`Erro ao atualizar estado: ${error.message}`);
      fetchUsers(); // Revert on error
    }
  };

  const toggleSuperadmin = async (userId: string, isSuperadmin: boolean) => {
    const confirmMsg = isSuperadmin 
      ? 'Tem a certeza que deseja remover os privilégios de Superadmin deste utilizador?'
      : 'Tem a certeza que deseja promover este utilizador a Superadmin? Terá acesso total ao sistema.';
      
    if (!confirm(confirmMsg)) return;

    // Optimistic UI Update
    setUsers(users.map(u => u.id === userId ? { ...u, is_superadmin: !isSuperadmin } : u));
    
    const { error } = await supabase
      .from('users')
      .update({ is_superadmin: !isSuperadmin })
      .eq('id', userId);

    if (error) {
      alert(`Erro ao atualizar privilégios: ${error.message}`);
      fetchUsers(); // Revert on error
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            Gestão de Utilizadores
          </h2>
          <p className="text-slate-400 mt-1">Administre as contas B2C e B2B em tempo real.</p>
        </div>
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Procurar utilizador..." 
            className="w-full bg-black border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      <div className="bg-black border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
        
        {loading ? (
          <div className="text-center py-12 text-slate-400">A carregar registos...</div>
        ) : (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-sm text-slate-400">
                  <th className="pb-3 font-semibold">Cliente</th>
                  <th className="pb-3 font-semibold">Espaços</th>
                  <th className="pb-3 font-semibold">Telefone</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Ações de Risco</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map(u => (
                  <tr key={u.id} className={`border-b border-slate-800/50 transition ${u.status === 'blocked' ? 'opacity-50' : 'hover:bg-white/5'}`}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${u.is_superadmin ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-slate-800 text-white'}`}>
                          {u.full_name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {u.full_name} 
                            {u.is_superadmin && <span title="Superadmin"><ShieldAlert className="w-3 h-3 text-red-500" /></span>}
                          </div>
                          <div className="text-xs text-slate-500">{u.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-400">
                      {u.spaces && u.spaces.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {u.spaces.map((s: any) => (
                            <div key={s.id} className="text-xs flex items-center gap-1">
                              <ArrowUpRight className="w-3 h-3 text-blue-500" />
                              <span className="font-medium text-slate-300">{s.name}</span>
                              <span className="opacity-50">({s.plan_type})</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs italic opacity-50">Sem espaços</span>
                      )}
                    </td>
                    <td className="py-4 text-slate-400 font-mono text-xs">{u.phone || '-'}</td>
                    <td className="py-4">
                      {u.status === 'blocked' ? (
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md text-[10px] font-bold uppercase tracking-wider">Bloqueado</span>
                      ) : (
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md text-[10px] font-bold uppercase tracking-wider">Ativo</span>
                      )}
                    </td>
                    <td className="py-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => toggleUserStatus(u.id, u.status)}
                        className={`p-2 rounded-lg transition ${u.status === 'blocked' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                        title={u.status === 'blocked' ? 'Reativar Conta' : 'Bloquear Conta'}
                      >
                        {u.status === 'blocked' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => toggleSuperadmin(u.id, u.is_superadmin)}
                        className={`p-2 rounded-lg transition border ${u.is_superadmin ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30' : 'bg-transparent border-slate-700 text-slate-500 hover:text-white'}`}
                        title={u.is_superadmin ? 'Remover Privilégios Root' : 'Promover a Superadmin'}
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                      Nenhum utilizador encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
