"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Users, Search, ShieldAlert, CheckCircle, Ban, ArrowUpRight, DollarSign } from 'lucide-react';

export default function RootUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchUsers = async () => {
    setLoading(true);
    // Fetch users with their spaces
    const { data: usersData, error } = await supabase
      .from('users')
      .select('*')
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

  const changeUserRole = async (userId: string, newRole: string) => {
    if (!confirm(`Tem a certeza que deseja alterar o papel deste utilizador para ${newRole.toUpperCase()}?`)) return;

    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert(`Erro ao atualizar papel: ${error.message}`);
      fetchUsers();
    }
  };

  const generateManualTransaction = async (userId: string) => {
    const amountStr = prompt("Valor a faturar (Ex: 19.00):", "19.00");
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) {
      alert("Valor inválido.");
      return;
    }
    const description = prompt("Descrição da Fatura (Ex: Mensalidade VIP):", "Mensalidade Personalizada");
    if (!description) return;

    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: amount,
        description: description,
        status: 'paid'
      });

    if (error) {
      alert(`Erro ao gerar transação: ${error.message}`);
    } else {
      alert("Transação registada com sucesso! O painel financeiro foi atualizado.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            Gestão de Utilizadores (RBAC)
          </h2>
          <p className="text-slate-400 mt-1">Defina permissões, bloqueios e pagamentos à medida.</p>
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

      <div className="bg-black border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-visible">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
        
        {loading ? (
          <div className="text-center py-12 text-slate-400">A carregar registos...</div>
        ) : (
          <div className="overflow-visible relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-sm text-slate-400">
                  <th className="pb-3 font-semibold">Cliente</th>
                  <th className="pb-3 font-semibold">Estatuto (Role)</th>
                  <th className="pb-3 font-semibold">Telefone</th>
                  <th className="pb-3 font-semibold text-center">Faturação</th>
                  <th className="pb-3 font-semibold text-right">Ações de Risco</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map(u => (
                  <tr key={u.id} className={`border-b border-slate-800/50 transition ${u.status === 'blocked' ? 'opacity-50' : 'hover:bg-white/5'}`}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${u.role === 'admin' || u.role === 'ceo' ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-slate-800 text-white'}`}>
                          {u.full_name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {u.full_name} 
                            {(u.role === 'admin' || u.role === 'ceo') && <span title="Administrador"><ShieldAlert className="w-3 h-3 text-red-500" /></span>}
                          </div>
                          <div className="text-xs text-slate-500">{u.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <select 
                        value={u.role || 'client'} 
                        onChange={(e) => changeUserRole(u.id, e.target.value)}
                        className={`bg-black border rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wider outline-none transition
                          ${u.role === 'admin' || u.role === 'ceo' ? 'border-red-500/50 text-red-400' : 
                            u.role === 'support' ? 'border-blue-500/50 text-blue-400' :
                            u.role === 'influencer' ? 'border-purple-500/50 text-purple-400' :
                            'border-slate-700 text-slate-400'}`}
                      >
                        <option value="client">Client</option>
                        <option value="influencer">Influencer</option>
                        <option value="support">Support</option>
                        <option value="admin">Admin / CEO</option>
                      </select>
                    </td>
                    <td className="py-4 text-slate-400 font-mono text-xs">{u.phone || '-'}</td>
                    <td className="py-4 text-center">
                      <button 
                        onClick={() => generateManualTransaction(u.id)}
                        className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition text-xs font-bold flex items-center gap-1 mx-auto"
                        title="Lançar Transação Manual"
                      >
                        <DollarSign className="w-3 h-3" /> Faturar
                      </button>
                    </td>
                    <td className="py-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => toggleUserStatus(u.id, u.status)}
                        className={`p-2 rounded-lg transition ${u.status === 'blocked' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                        title={u.status === 'blocked' ? 'Reativar Conta' : 'Bloquear Conta (Interromper Serviço)'}
                      >
                        {u.status === 'blocked' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                      Nenhum utilizador encontrado. Execute o Trigger SQL para sincronizar auth.users.
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
