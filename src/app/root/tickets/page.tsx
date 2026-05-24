"use client";

import React from 'react';
import { Ticket, Search, Filter, Reply, CheckCircle } from 'lucide-react';

export default function RootTickets() {
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">Helpdesk (Aura Care)</h2>
          <p className="text-slate-400 mt-1">Gestão de Tickets e Suporte ao Cliente.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Procurar ticket..." 
              className="bg-black border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <button className="bg-black border border-slate-800 p-2 rounded-xl text-slate-400 hover:text-white transition">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-black border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Lista de Tickets */}
        <div className="w-1/3 border-r border-slate-800 flex flex-col bg-[#050505]">
          <div className="p-4 border-b border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-500 flex justify-between">
            <span>Caixa de Entrada</span>
            <span className="text-blue-500">2 Abertos</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Ticket 1 */}
            <div className="p-4 border-b border-slate-800/50 hover:bg-white/5 cursor-pointer transition border-l-2 border-l-blue-500 bg-blue-500/5">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-bold text-white">Luzes não respondem</span>
                <span className="text-xs text-slate-500">Há 2h</span>
              </div>
              <div className="text-xs font-semibold text-slate-400 mb-2">João Silva (Home Pro)</div>
              <p className="text-xs text-slate-500 truncate">A Kira Vision não está a conseguir acender as luzes da sala principal, diz que o IP...</p>
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded">High Priority</span>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded">Open</span>
              </div>
            </div>

            {/* Ticket 2 */}
            <div className="p-4 border-b border-slate-800/50 hover:bg-white/5 cursor-pointer transition">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-bold text-white">Faturação duplicada?</span>
                <span className="text-xs text-slate-500">Ontem</span>
              </div>
              <div className="text-xs font-semibold text-slate-400 mb-2">SmartSolutions (Integrador)</div>
              <p className="text-xs text-slate-500 truncate">Recebemos duas faturas este mês na nossa conta de empresa. Podem verificar?</p>
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold rounded">Financeiro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ecrã de Conversa */}
        <div className="flex-1 flex flex-col relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20">
          <div className="p-6 border-b border-slate-800 bg-black/80 backdrop-blur-md flex justify-between items-center z-10">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Luzes não respondem</h3>
              <p className="text-xs text-slate-400">De: João Silva (joao@example.com) • ID: #TCK-8923</p>
            </div>
            <button className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-4 py-2 rounded-xl text-sm font-bold transition">
              <CheckCircle className="w-4 h-4" /> Marcar como Resolvido
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 z-10">
            {/* Mensagem do Cliente */}
            <div className="flex gap-4 max-w-2xl">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 shrink-0">JS</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-white">João Silva</span>
                  <span className="text-xs text-slate-500">Hoje às 10:14</span>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-300 leading-relaxed">
                  Bom dia equipa técnica. Desde ontem à noite que a Kira Vision deixou de controlar as luzes Zigbee da minha sala. Recebo um erro de "Time Out". Conseguem reiniciar o meu hub na Cloud? Obrigado!
                </div>
              </div>
            </div>

            {/* Resposta do Suporte (Exemplo de IA) */}
            <div className="flex gap-4 max-w-2xl self-end flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span className="text-xs text-slate-500">Rascunho Sugerido pela Kira IA</span>
                  <span className="font-bold text-sm text-blue-400">Aura Support</span>
                </div>
                <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-2xl rounded-tr-sm text-sm text-blue-100 leading-relaxed text-left">
                  Olá João, obrigado por nos contactar. Verificamos que o seu Hub perdeu a ligação aos nossos servidores por breves instantes. Já enviámos um sinal de Reboot remoto. As luzes devem voltar a responder em 2 minutos. Confirme por favor!
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-800 bg-black/80 backdrop-blur-md z-10">
            <div className="relative">
              <textarea 
                placeholder="Escreva a sua resposta ao cliente..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition resize-none h-20"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition shadow-lg">
                <Reply className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
