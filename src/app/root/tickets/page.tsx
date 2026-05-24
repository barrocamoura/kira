"use client";

import React, { useState, useEffect } from 'react';
import { Ticket, Search, Filter, Reply, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function RootTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tickets')
      .select('*, author:users!tickets_user_id_fkey(full_name), ticket_messages(message, created_at, user_id, author:users!ticket_messages_user_id_fkey(full_name))')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTickets(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
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

    if (error) {
      alert("Erro ao enviar resposta: " + error.message);
    } else {
      setReplyText('');
      fetchTickets();
      const updatedTicket = { ...selectedTicket };
      updatedTicket.ticket_messages.push({
        message: replyText,
        created_at: new Date().toISOString(),
        user_id: user.id,
        author: { full_name: 'Admin' }
      });
      setSelectedTicket(updatedTicket);
    }
  };

  const markAsResolved = async () => {
    if (!selectedTicket) return;
    const { error } = await supabase
      .from('tickets')
      .update({ status: 'closed' })
      .eq('id', selectedTicket.id);

    if (error) {
      alert("Erro: " + error.message);
    } else {
      setSelectedTicket({ ...selectedTicket, status: 'closed' });
      fetchTickets();
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">Helpdesk (Aura Care)</h2>
          <p className="text-slate-400 mt-1">Gestão de Tickets e Suporte ao Cliente.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchTickets} className="text-xs font-bold text-blue-500 hover:text-blue-400">Atualizar</button>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Procurar ticket..." 
              className="bg-black border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-black border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex min-h-[600px]">
        {/* Lista de Tickets */}
        <div className="w-1/3 border-r border-slate-800 flex flex-col bg-[#050505]">
          <div className="p-4 border-b border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-500 flex justify-between">
            <span>Caixa de Entrada</span>
            <span className="text-blue-500">{tickets.filter(t => t.status === 'open').length} Abertos</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-slate-500 text-xs text-center">A carregar...</div>
            ) : tickets.length === 0 ? (
               <div className="p-4 text-slate-500 text-xs text-center">Nenhum ticket encontrado.</div>
            ) : (
              tickets.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 border-b border-slate-800/50 hover:bg-white/5 cursor-pointer transition ${selectedTicket?.id === t.id ? 'border-l-2 border-l-blue-500 bg-blue-500/5' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-white truncate pr-2">{t.subject}</span>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{new Date(t.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-400 mb-2">{t.author?.full_name || 'Cliente'}</div>
                  <div className="mt-3 flex gap-2">
                    {t.status === 'open' ? (
                       <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded uppercase">Aberto</span>
                    ) : (
                       <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase">Resolvido</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ecrã de Conversa */}
        <div className="flex-1 flex flex-col relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20">
          {!selectedTicket ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-4">
              <Ticket className="w-12 h-12 opacity-20" />
              <p>Selecione um ticket para visualizar a conversa.</p>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-slate-800 bg-black/80 backdrop-blur-md flex justify-between items-center z-10">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{selectedTicket.subject}</h3>
                  <p className="text-xs text-slate-400">De: {selectedTicket.author?.full_name}</p>
                </div>
                {selectedTicket.status === 'open' && (
                  <button onClick={markAsResolved} className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-4 py-2 rounded-xl text-sm font-bold transition">
                    <CheckCircle className="w-4 h-4" /> Marcar como Resolvido
                  </button>
                )}
              </div>

              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 z-10">
                {selectedTicket.ticket_messages?.map((msg: any, i: number) => {
                  const isClient = msg.user_id === selectedTicket.user_id;
                  
                  return (
                    <div key={i} className={`flex gap-4 max-w-2xl ${isClient ? '' : 'self-end flex-row-reverse'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isClient ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white'}`}>
                        {isClient ? 'C' : 'S'}
                      </div>
                      <div className={isClient ? 'text-left' : 'text-right'}>
                        <div className={`flex items-center gap-2 mb-1 ${isClient ? '' : 'justify-end'}`}>
                          <span className={`font-bold text-sm ${isClient ? 'text-white' : 'text-blue-400'}`}>
                            {isClient ? selectedTicket.author?.full_name : 'Aura Support'}
                          </span>
                          <span className="text-xs text-slate-500">{new Date(msg.created_at).toLocaleString()}</span>
                        </div>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isClient ? 'bg-slate-800/50 border border-slate-700/50 rounded-tl-sm text-slate-300' : 'bg-blue-600/20 border border-blue-500/30 rounded-tr-sm text-blue-100 text-left'}`}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedTicket.status === 'open' && (
                <div className="p-4 border-t border-slate-800 bg-black/80 backdrop-blur-md z-10">
                  <div className="relative">
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Escreva a resposta para o cliente..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition resize-none h-20"
                    />
                    <button onClick={handleReply} className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition shadow-lg">
                      <Reply className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
