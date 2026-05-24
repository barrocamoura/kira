"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, Ticket, Users, Search, CheckCircle, Reply, ShieldAlert, Ban, UserCog } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function COODashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Users
    const { data: usersData } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (usersData) setUsers(usersData);

    // Fetch Tickets (Usando o novo schema)
    const { data: ticketsData } = await supabase
      .from('tickets')
      .select('*, author:users!tickets_user_id_fkey(full_name), ticket_messages(message, created_at, user_id, author:users!ticket_messages_user_id_fkey(full_name))')
      .order('created_at', { ascending: false });

    if (ticketsData) setTickets(ticketsData);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: selectedTicket.id,
        user_id: user.id,
        message: replyText
      });

    if (!error) {
      setReplyText('');
      fetchData();
      const updatedTicket = { ...selectedTicket };
      updatedTicket.ticket_messages.push({
        message: replyText,
        created_at: new Date().toISOString(),
        user_id: user.id,
        author: { full_name: 'Tech Support' }
      });
      setSelectedTicket(updatedTicket);
    }
  };

  const markAsResolved = async () => {
    if (!selectedTicket) return;
    await supabase.from('tickets').update({ status: 'closed' }).eq('id', selectedTicket.id);
    setSelectedTicket({ ...selectedTicket, status: 'closed' });
    fetchData();
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    await supabase.from('users').update({ status: newStatus }).eq('id', userId);
  };

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-amber-500" />
            Operations & Support
          </h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-bold">Office of the COO / Tech Team</p>
        </div>
      </div>

      {/* DUAL PANE LAYOUT */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0">
        
        {/* PANE 1: HELPDESK */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden flex flex-col relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-black/40 relative z-10">
            <div className="flex items-center gap-2 text-amber-500 font-bold uppercase tracking-widest text-sm">
              <Ticket className="w-5 h-5" /> Helpdesk Inbox
            </div>
            <div className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-bold">
              {tickets.filter(t => t.status === 'open').length} Open
            </div>
          </div>

          <div className="flex-1 flex min-h-0 relative z-10">
            {/* Lista de Tickets */}
            <div className="w-1/3 border-r border-slate-800 bg-black/20 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-slate-500 text-xs">Loading...</div>
              ) : tickets.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">Inbox Zero 🎉</div>
              ) : (
                tickets.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 border-b border-slate-800/50 cursor-pointer transition ${selectedTicket?.id === t.id ? 'bg-amber-500/10 border-l-2 border-l-amber-500' : 'hover:bg-white/5'}`}
                  >
                    <div className="text-sm font-bold text-white truncate">{t.subject}</div>
                    <div className="text-xs text-slate-400 mt-1 truncate">{t.author?.full_name || 'Client'}</div>
                    <div className="mt-2 flex gap-2">
                      {t.status === 'open' ? (
                         <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded uppercase">Open</span>
                      ) : (
                         <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase">Closed</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Area */}
            <div className="w-2/3 flex flex-col bg-black/10">
              {!selectedTicket ? (
                <div className="flex-1 flex items-center justify-center text-slate-500">Select a ticket to view</div>
              ) : (
                <>
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white">{selectedTicket.subject}</h3>
                    {selectedTicket.status === 'open' && (
                      <button onClick={markAsResolved} className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                        <CheckCircle className="w-4 h-4" /> Resolve
                      </button>
                    )}
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
                    {selectedTicket.ticket_messages?.map((msg: any, i: number) => {
                      const isClient = msg.user_id === selectedTicket.user_id;
                      return (
                        <div key={i} className={`flex flex-col max-w-[80%] ${isClient ? 'self-start' : 'self-end'}`}>
                          <div className={`text-[10px] font-bold text-slate-500 mb-1 ${isClient ? 'text-left' : 'text-right'}`}>
                            {isClient ? selectedTicket.author?.full_name : 'Support Team'}
                          </div>
                          <div className={`p-3 rounded-2xl text-sm ${isClient ? 'bg-slate-800 text-slate-200 rounded-tl-sm' : 'bg-amber-600/20 text-amber-100 border border-amber-500/30 rounded-tr-sm'}`}>
                            {msg.message}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {selectedTicket.status === 'open' && (
                    <div className="p-4 border-t border-slate-800 bg-black/40">
                      <div className="relative">
                        <input 
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                          placeholder="Type your reply..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                        />
                        <button onClick={handleReply} className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500 text-black p-1.5 rounded-lg hover:bg-amber-400 transition">
                          <Reply className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* PANE 2: CRM & USERS */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden flex flex-col relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-black/40 relative z-10">
            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-sm">
              <UserCog className="w-5 h-5" /> Client Management (CRM)
            </div>
            <div className="relative w-48">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto relative z-10 p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <th className="p-4 font-bold">Client</th>
                  <th className="p-4 font-bold">Role</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="p-8 text-center text-slate-500 text-xs">Loading CRM...</td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className={`border-b border-slate-800/30 hover:bg-white/5 transition ${u.status === 'blocked' ? 'opacity-50' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${u.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-white'}`}>
                            {u.full_name?.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              {u.full_name} {u.role === 'admin' && <ShieldAlert className="w-3 h-3 text-red-500" />}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">{u.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-[10px] font-bold uppercase text-slate-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => toggleUserStatus(u.id, u.status)}
                          className={`p-2 rounded-lg transition ${u.status === 'blocked' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                          title={u.status === 'blocked' ? 'Reactivate Account' : 'Suspend Account'}
                        >
                          {u.status === 'blocked' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
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
    </div>
  );
}
