"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Building2, Workflow, ArrowRight, ShieldCheck, Zap, Home, LayoutDashboard, Cpu, Network } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <span className="font-black text-xl tracking-tighter">AURA OS</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-sm font-bold text-white/60 hover:text-white transition">Para Casas</a>
          <a href="#enterprise" className="text-sm font-bold text-white/60 hover:text-white transition">Para Construtoras</a>
          <a href="#pricing" className="text-sm font-bold text-white/60 hover:text-white transition">Planos</a>
        </div>
        <button 
          onClick={() => router.push('/login')} 
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-bold transition flex items-center gap-2"
        >
          Acesso ao Sistema <ArrowRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-8 overflow-hidden flex flex-col items-center text-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-8">
          <Zap className="w-4 h-4" /> A revolução inteligente chegou
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter max-w-5xl leading-[1.1] mb-8">
          O Cérebro do seu <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Edifício Inteligente.
          </span>
        </h1>

        <p className="text-xl text-white/50 max-w-3xl mb-12 font-medium">
          Uma única plataforma unificada. Desde o utilizador final que quer controlar a luz da sala em 3D, até à construtora que gere mil apartamentos remotamente.
        </p>
      </section>

      {/* Dual Value Proposition */}
      <section id="home" className="py-24 px-8 border-t border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* B2C: Aura Home */}
          <div className="p-10 rounded-[2.5rem] bg-black border border-white/10 hover:border-blue-500/30 transition duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition">
              <Home className="w-48 h-48 text-blue-500" />
            </div>
            <div className="relative z-10">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-widest mb-6">Utilizador Final</div>
              <h2 className="text-4xl font-black mb-6">Aura Home</h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">O fim das dezenas de apps de automação. Controle toda a sua casa através de um modelo 3D digital interativo.</p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-white/80"><LayoutDashboard className="w-5 h-5 text-blue-400" /> Widgets de Controlo em Tempo Real</li>
                <li className="flex items-center gap-3 text-white/80"><Workflow className="w-5 h-5 text-blue-400" /> Automações Visuais em Fluxograma</li>
                <li className="flex items-center gap-3 text-white/80"><ShieldCheck className="w-5 h-5 text-blue-400" /> Privacidade e Processamento Local</li>
              </ul>
            </div>
          </div>

          {/* B2B: Aura Enterprise */}
          <div className="p-10 rounded-[2.5rem] bg-black border border-white/10 hover:border-purple-500/30 transition duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition">
              <Building2 className="w-48 h-48 text-purple-500" />
            </div>
            <div className="relative z-10">
              <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold uppercase tracking-widest mb-6">Construtoras & Integradores</div>
              <h2 className="text-4xl font-black mb-6">Aura Enterprise</h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">Eleve o valor do seu empreendimento. Entregue apartamentos já inteligentes sob a sua própria marca e portal.</p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-white/80"><Building2 className="w-5 h-5 text-purple-400" /> Gestão Multi-Site de Centenas de Frações</li>
                <li className="flex items-center gap-3 text-white/80"><Sparkles className="w-5 h-5 text-purple-400" /> Whitelabel B2B (Logótipo e Cores da sua Marca)</li>
                <li className="flex items-center gap-3 text-white/80"><Network className="w-5 h-5 text-purple-400" /> Manutenção e Suporte Remoto Centralizado</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-8 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6">Planos de Subscrição</h2>
            <p className="text-white/50 text-xl max-w-2xl mx-auto">Escolha o motor perfeito para o seu contexto de operação.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Plan 1 */}
            <div className="p-8 rounded-3xl bg-[#111] border border-white/10">
              <h3 className="text-2xl font-bold mb-2">Aura Home</h3>
              <p className="text-white/50 mb-6">Para residentes e proprietários únicos.</p>
              <div className="text-5xl font-black mb-8">€19<span className="text-xl text-white/40 font-medium">/mês</span></div>
              <button className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition mb-8">Começar Agora</button>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> 1 Residência Principal</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Motor 3D Interativo Completo</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Ilimitadas Automações KIRA</li>
              </ul>
            </div>

            {/* Plan 2 */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-900/40 to-black border border-indigo-500/50 relative transform md:-translate-y-4 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Recomendado B2B</div>
              <h3 className="text-2xl font-bold mb-2 text-indigo-100">Aura Enterprise</h3>
              <p className="text-white/50 mb-6">Para construtoras e integradores profissionais.</p>
              <div className="text-5xl font-black mb-8 text-white">Contactar<span className="text-xl text-white/40 font-medium"> Vendas</span></div>
              <button className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold transition mb-8">Falar com Consultor</button>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"/> Múltiplas Residências e Edifícios</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"/> Portal Whitelabel (Marca Própria)</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"/> Contas de Gestão Remota Avançada</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"/> API de Faturamento B2B Integrada</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
