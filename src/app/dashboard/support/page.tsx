"use client";

import React, { useState } from 'react';
import { LifeBuoy, Search, MessageSquarePlus, ChevronDown, CheckCircle2 } from 'lucide-react';

const FAQS = [
  {
    q: 'Como reinicio a minha ligação Wi-Fi?',
    a: 'Vá à página de Dispositivos, selecione o HUB principal e clique em "Reiniciar Antena". Demora cerca de 45 segundos a voltar online.'
  },
  {
    q: 'Posso convidar a minha família?',
    a: 'Sim. Em breve, a secção "Membros" permitirá enviar convites por E-mail para que eles tenham acesso remoto.'
  },
  {
    q: 'A Kira não reconheceu o meu quarto na foto. E agora?',
    a: 'A tecnologia de visão espacial ainda está em fase Beta. Tente tirar a foto com mais luz, ou, em alternativa, desenhe as paredes manualmente no "Modo Arquiteto".'
  }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Simularemos o envio do Ticket aqui. No backend gravaremos nas tabelas tickets e ticket_messages
    alert("Ticket aberto com sucesso! A nossa equipa de engenharia responderá em breve.");
    setIsTicketOpen(false);
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <LifeBuoy className="w-8 h-8 text-blue-500" /> Aura Care
        </h1>
        <p className="text-white/50 mt-2">Suporte Técnico, FAQs e Ajuda com Inteligência Artificial.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FAQs */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-400" /> Dúvidas Frequentes
          </h2>
          <div className="flex flex-col gap-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:bg-white/5 transition"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="p-5 flex items-center justify-between">
                  <h3 className="font-semibold text-white/90">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Abrir Ticket */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-emerald-400" /> Falar com Especialista
          </h2>
          
          <div className="bg-gradient-to-b from-blue-900/20 to-black border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
            
            {!isTicketOpen ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-white mb-2">Não encontrou o que procurava?</h3>
                <p className="text-sm text-white/50 mb-6 max-w-sm mx-auto">
                  Abra um Ticket diretamente para a nossa equipa de engenheiros. Tempo médio de resposta: 4h.
                </p>
                <button 
                  onClick={() => setIsTicketOpen(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                >
                  Criar Novo Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="flex flex-col gap-4 animate-in fade-in duration-300 relative z-10">
                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-2">Assunto</label>
                  <input 
                    type="text" 
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Ex: Luzes não respondem ao Aura Vision"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-2">Descrição Detalhada</label>
                  <textarea 
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Descreva o seu problema detalhadamente..."
                    rows={4}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition resize-none"
                    required
                  />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button 
                    type="button"
                    onClick={() => setIsTicketOpen(false)}
                    className="flex-1 py-3 text-white/50 hover:text-white transition font-bold"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition shadow-lg"
                  >
                    Enviar Pedido
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
