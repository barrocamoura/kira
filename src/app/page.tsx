"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { X, Shield, Zap, Target, Sparkles, ChevronRight, BrainCircuit, Globe, Workflow } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function AuraLandingPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const [kiraStep, setKiraStep] = useState(0);
  const kiraSteps = [
    { text: '"Kira, ativar Modo Cinema."', response: 'Iniciando Modo Cinema...' },
    { text: '"Kira, ativar Modo Cinema."', response: 'Iniciando Modo Cinema...\n> Fechando persianas' },
    { text: '"Kira, ativar Modo Cinema."', response: 'Iniciando Modo Cinema...\n> Fechando persianas\n> Ajustando luz para 10%' },
    { text: '"Kira, ativar Modo Cinema."', response: 'Iniciando Modo Cinema...\n> Fechando persianas\n> Ajustando luz para 10%\n> Ligando ecrã. Bom filme.' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(() => {
      setKiraStep((prev) => (prev + 1) % kiraSteps.length);
    }, 4500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (audioEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Only speak the last added line
      const lines = kiraSteps[kiraStep].response.split('\n');
      const lastLine = lines[lines.length - 1];
      const textToSpeak = lastLine.replace(/>/g, '').replace(/\n/g, '. ');
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'pt-PT';
      utterance.rate = 0.95;
      utterance.pitch = 1.2;
      
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang.includes('pt') && (v.name.includes('Female') || v.name.includes('Luciana') || v.name.includes('Joana') || v.name.includes('Francisca'))) || voices.find(v => v.lang.includes('pt'));
      if (ptVoice) utterance.voice = ptVoice;

      window.speechSynthesis.speak(utterance);
    }
  }, [kiraStep, audioEnabled]);

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      
      {/* Navbar Premium */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl py-3' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 p-[1px] group-hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-all">
              <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-black text-lg">A</span>
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">Aura OS</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-400">
            <a href="#vision" className="hover:text-white transition">Visão</a>
            <a href="#kira" className="hover:text-white transition flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400"/> Kira AI</a>
            <a href="#features" className="hover:text-white transition">Ecossistema</a>
            <a href="#pricing" className="hover:text-white transition">Preçário</a>
            <Link href="/login" className="hover:text-white transition ml-4">Login</Link>
          </div>
          <Link href="/onboarding" className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2">
            Testar Grátis <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-10 backdrop-blur-md animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-white tracking-widest uppercase">Kira AI Engine Live</span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-8 max-w-6xl leading-[1.05] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          O Sistema Operativo <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-500">do seu Espaço.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mb-12 font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          A domótica tradicional falhou. O Aura OS transforma casas, escritórios e condomínios num ecossistema vivo onde Humanos e Inteligência Artificial trabalham de mãos dadas.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5 w-full justify-center relative z-10 mb-20 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Link href="/onboarding" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black text-lg font-black hover:scale-105 transition-all shadow-[0_0_50px_rgba(52,211,153,0.4)] flex items-center justify-center gap-2">
            Começar Agora <ChevronRight className="w-5 h-5" />
          </Link>
          <a href="#vision" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#111] hover:bg-[#1a1a1a] text-white border border-white/10 text-lg font-bold transition-colors">
            Descobrir Mais
          </a>
        </div>

        {/* Hero Image / Mockup */}
        <div className="relative w-full max-w-5xl mx-auto mt-10 group cursor-pointer animate-fade-in-up" style={{ animationDelay: '400ms', perspective: '2000px' }}>
          <div 
            className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.3)] transition-all duration-1000 ease-out"
            style={{ transform: 'rotateX(20deg) scale(0.95)', transformStyle: 'preserve-3d' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotateX(0deg) scale(1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotateX(20deg) scale(0.95)';
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent z-10 pointer-events-none" />
            <img 
              src="/images/aura-dashboard.png" 
              alt="Aura OS Dashboard Interface" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>
      </section>

      {/* The Problem / Vision */}
      <section id="vision" className="py-32 px-6 bg-[#030303] relative border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
            Até hoje, edifícios inteligentes eram complexos, <span className="text-slate-500">caros e limitados.</span>
          </h2>
          <p className="text-xl text-slate-400 font-light leading-relaxed">
            Painéis confusos, cabos infinitos e sistemas que não comunicam entre si. O Aura OS foi desenhado do zero para centralizar tudo. Crie a planta 3D do seu espaço num editor interativo, ligue os seus sensores IoT em segundos e deixe a nossa IA governar a eficiência energética e segurança.
          </p>
        </div>
      </section>

      {/* Kira AI Section (Hand in Hand) */}
      <section id="kira" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-8">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Inteligência Operacional</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1]">
                O Humano e a IA,<br/>
                de mãos dadas.
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                A nossa assistente IA (Kira) não o substitui; ela capacita-o. Ela aprende as suas rotinas térmicas para poupar na fatura da luz. Avisa proativamente se a porta da garagem ficou aberta. Sugere automações que o humano jamais teria tempo para programar. O poder de decisão final é sempre seu.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Eficiência Energética Adaptativa</h4>
                    <p className="text-slate-400 text-sm mt-1">A IA prevê o clima e a ocupação da sala, ajustando o AC antes sequer de sentir frio ou calor, cortando até 35% na fatura.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Anomalias de Segurança 24/7</h4>
                    <p className="text-slate-400 text-sm mt-1">Deteta movimento fora do padrão e notifica imediatamente a equipa ou o dono, podendo ativar simulações de presença reais.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-slate-900 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden flex flex-col items-center justify-center text-center group">
                
                {/* 2.5D Background Environment */}
                <div className="absolute inset-0 transition-all duration-1000 z-0 overflow-hidden">
                  {/* Simulated Blinds */}
                  <div className={`absolute inset-0 flex justify-between transition-all duration-[2000ms] ease-in-out ${kiraStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="w-full h-full bg-[#050505] border-r border-black/80" style={{ transform: kiraStep >= 1 ? 'rotateY(0deg)' : 'rotateY(90deg)', transformOrigin: 'left', transition: 'transform 2s ease-in-out' }} />
                    ))}
                  </div>
                  {/* Simulated Dimming */}
                  <div className={`absolute inset-0 bg-black transition-opacity duration-[2000ms] ${kiraStep >= 2 ? 'opacity-90' : 'opacity-0'}`} />
                  {/* Simulated TV Glow */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/20 blur-[100px] transition-opacity duration-[2000ms] ${kiraStep >= 3 ? 'opacity-100' : 'opacity-0'}`} />
                </div>

                {/* Foreground Kira Avatar & Terminal */}
                <div className="relative z-10 w-full h-full p-8 flex flex-col items-center justify-center">
                  {/* Kira Avatar Image (Animated Hologram) */}
                  <div className="relative w-40 h-40 mb-6 rounded-full border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(52,211,153,0.5)] overflow-hidden">
                    <div className={`absolute inset-0 mix-blend-overlay z-10 transition-colors duration-1000 ${kiraStep >= 3 ? 'bg-blue-500/30' : 'bg-emerald-500/20'} ${audioEnabled ? 'animate-pulse' : ''}`}></div>
                    <div className="w-full h-full animate-[pulse_3s_ease-in-out_infinite]">
                      <img src="/images/kira-avatar.png" alt="Kira Avatar" className="w-full h-full object-cover opacity-90 scale-110" />
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`mb-6 px-4 py-1.5 rounded-full text-xs font-bold transition-colors z-20 border ${audioEnabled ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-black/50 text-slate-400 border-white/20 hover:text-white backdrop-blur-sm'}`}
                  >
                    {audioEnabled ? '🔊 Áudio Ativado' : '🔇 Ativar Voz da Kira'}
                  </button>
                  
                  {/* Interactive Terminal */}
                  <div className="h-[140px] flex flex-col justify-start items-center w-full z-10">
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-4 z-10 drop-shadow-lg">
                      {kiraSteps[kiraStep].text}
                    </h3>
                    <div className="text-emerald-400 font-mono text-sm z-10 bg-black/80 w-full max-w-sm p-4 rounded-xl border border-emerald-500/20 text-left shadow-inner shadow-emerald-500/10 backdrop-blur-md transition-all duration-300 min-h-[100px]">
                      {kiraSteps[kiraStep].response.split('\n').map((line, i) => (
                        <span key={`${kiraStep}-${i}`} className="block animate-fade-in-up">{line}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-end Bento Grid Ecosystem */}
      <section id="features" className="py-32 px-6 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Um Ecossistema Sem Limites</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Seja um apartamento, um hotel ou uma multinacional. O Aura OS adapta-se e escala consigo de forma impercetível.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Bento 1: 3D Mapping */}
            <div className="md:col-span-2 row-span-2 rounded-[2rem] bg-gradient-to-br from-[#151515] to-[#0a0a0a] border border-white/5 p-10 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <Globe className="w-12 h-12 text-blue-400 mb-6" />
                  <h3 className="text-3xl font-black mb-3">Mapeamento 3D Digital Twin</h3>
                  <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                    Não usamos listas aborrecidas de botões. Desenhe o seu edifício e navegue num motor gráfico em tempo real. Clique num candeeiro na planta para o acender no mundo real.
                  </p>
                </div>
              </div>
            </div>

            {/* Bento 2: Kiosk Mode */}
            <div className="rounded-[2rem] bg-[#111] border border-white/5 p-8 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <Target className="w-8 h-8 text-fuchsia-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Modo Kiosk (Wall-mount)</h3>
                <p className="text-slate-400 text-sm">Transforme qualquer tablet num painel de parede interativo com widgets bloqueados para os hóspedes ou funcionários.</p>
              </div>
            </div>

            {/* Bento 3: Automations */}
            <div className="rounded-[2rem] bg-[#111] border border-white/5 p-8 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <Workflow className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Automações No-Code</h3>
                <p className="text-slate-400 text-sm">Motor lógico visual. Arraste e crie regras como "Se a porta abrir, envia notificação Push e grava a câmara".</p>
              </div>
            </div>

            {/* Bento 4: B2B Whitelabel */}
            <div className="md:col-span-3 rounded-[2rem] bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border border-emerald-500/20 p-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl">
                <h3 className="text-3xl font-black mb-4 text-white">Whitelabel B2B (Construtoras)</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Vende imóveis de luxo? Entregue as chaves juntamente com a aplicação do Aura OS personalizada com o <strong className="text-white">Seu Logótipo</strong> e as <strong className="text-white">Suas Cores</strong>. Aumente o valor percecionado do imóvel no mercado.
                </p>
              </div>
              <a href="mailto:vendas@sperosystems.com" className="px-8 py-4 rounded-xl bg-white text-black font-bold whitespace-nowrap hover:scale-105 transition-transform">
                Falar com Vendas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - High Conversion */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Investimento que se paga a si mesmo.</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">A poupança energética gerada cobre largamente o valor da subscrição.</p>
          </div>

          <div className="flex justify-center mb-16 relative z-20">
            <div className="bg-[#111] p-1.5 rounded-2xl inline-flex border border-white/10 items-center shadow-2xl shadow-emerald-500/5">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all ${!isAnnual ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Mensal
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-emerald-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Anual
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ${isAnnual ? 'bg-black/20 font-black' : 'bg-emerald-500/20 text-emerald-400'}`}>2 meses grátis</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative z-10">
            
            {/* PLANO 1: TRIAL */}
            <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 flex flex-col hover:border-white/20 transition-colors">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
                <p className="text-slate-500 text-sm">Para provar o valor sem risco.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="text-4xl font-black mb-2">Grátis</div>
                <div className="text-slate-400 font-medium text-sm">Por 15 dias corridos</div>
              </div>
              <ul className="space-y-4 mb-8 text-slate-300 text-sm flex-1">
                <li className="flex items-center gap-3">✓ <span>1 Espaço (Casa)</span></li>
                <li className="flex items-center gap-3">✓ <span>Kira AI Básica</span></li>
                <li className="flex items-center gap-3">✓ <span>Máx 10 Equipamentos</span></li>
              </ul>
              <Link href="/onboarding" className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-center transition">
                Iniciar Trial
              </Link>
            </div>

            {/* PLANO 2: HOME */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111815] to-[#0a0f0d] border border-emerald-500/40 relative flex flex-col transform md:-translate-y-4 shadow-[0_30px_60px_rgba(16,185,129,0.15)] group">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-emerald-500 text-black text-xs font-black rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                O Mais Escolhido
              </div>
              <div className="mb-8 mt-2">
                <h3 className="text-2xl font-black mb-2 text-emerald-400">Aura Home</h3>
                <p className="text-slate-400 text-sm">Para residências de luxo e famílias.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="text-5xl font-black mb-2 flex items-baseline gap-1 text-white">
                  €{isAnnual ? '190' : '19'}
                  <span className="text-lg text-slate-500 font-medium">/{isAnnual ? 'ano' : 'mês'}</span>
                </div>
                <div className="text-emerald-500/80 text-sm font-semibold">Cancela quando quiseres</div>
              </div>
              <ul className="space-y-4 mb-8 text-slate-200 text-sm flex-1 font-medium">
                <li className="flex items-center gap-3"><span className="text-emerald-400 text-lg">✓</span> <span>Equipamentos Ilimitados</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400 text-lg">✓</span> <span>Kira Automations e Cenas</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400 text-lg">✓</span> <span>Acesso Familiar Total</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400 text-lg">✓</span> <span>Modo Kiosk Tablet</span></li>
              </ul>
              <button 
                onClick={async () => {
                  try {
                    const res = await fetch('/api/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ plan: isAnnual ? 'home_yearly' : 'home_monthly' })
                    });
                    const data = await res.json();
                    if (data.clientSecret) {
                      setClientSecret(data.clientSecret);
                      setShowCheckout(true);
                    } else {
                      alert(data.error || 'Erro ao iniciar pagamento.');
                    }
                  } catch(e) {
                    alert('Erro na ligação.');
                  }
                }}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-center transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 relative z-20"
              >
                Subscrever Home
              </button>
            </div>

            {/* PLANO 3: ENTERPRISE */}
            <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 flex flex-col hover:border-white/20 transition-colors">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-blue-400">Aura Enterprise</h3>
                <p className="text-slate-500 text-sm">Para escritórios e PMEs.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="text-4xl font-black mb-2 flex items-baseline gap-1 text-white">
                  €{isAnnual ? '1000' : '100'}
                  <span className="text-lg text-slate-500 font-normal">/{isAnnual ? 'ano' : 'mês'}</span>
                </div>
                <div className="text-slate-400 text-sm">Até 10 Espaços B2B</div>
              </div>
              <ul className="space-y-4 mb-8 text-slate-300 text-sm flex-1">
                <li className="flex items-center gap-3">✓ <span>Múltiplos Edifícios (Multi-Tenant)</span></li>
                <li className="flex items-center gap-3">✓ <span>Controlo de Acessos de Staff</span></li>
                <li className="flex items-center gap-3">✓ <span>Relatórios Fiscais de Energia</span></li>
              </ul>
              <button 
                onClick={async () => {
                  try {
                    const res = await fetch('/api/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ plan: isAnnual ? 'enterprise_yearly' : 'enterprise_monthly' })
                    });
                    const data = await res.json();
                    if (data.clientSecret) {
                      setClientSecret(data.clientSecret);
                      setShowCheckout(true);
                    } else {
                      alert(data.error || 'Erro ao iniciar pagamento.');
                    }
                  } catch(e) {
                    alert('Erro na ligação.');
                  }
                }}
                className="w-full py-4 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-bold text-center transition"
              >
                Subscrever Enterprise
              </button>
            </div>

            {/* PLANO 4: WHITELABEL */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#111] to-[#050505] border border-amber-500/20 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none" />
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-bold mb-2 text-amber-400">Whitelabel B2B</h3>
                <p className="text-slate-500 text-sm">A solução definitiva para Imobiliárias.</p>
              </div>
              <div className="mb-8 flex-1 relative z-10">
                <div className="text-3xl font-black mb-2 text-white">Sob Consulta</div>
                <div className="text-slate-400 text-sm">Contratos de larga escala</div>
              </div>
              <ul className="space-y-4 mb-8 text-slate-300 text-sm flex-1 relative z-10">
                <li className="flex items-center gap-3">✓ <span>A sua Marca (Cores + Logo)</span></li>
                <li className="flex items-center gap-3">✓ <span>Edifícios Ilimitados</span></li>
                <li className="flex items-center gap-3">✓ <span>SLA e Suporte Dedicado</span></li>
              </ul>
              <a href="mailto:vendas@sperosystems.com" className="w-full py-4 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black border border-amber-500/30 font-bold text-center transition relative z-10 block">
                Contactar Especialista
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm bg-[#030303]">
        <p className="mb-2">Desenhado para o Futuro.</p>
        <p>© 2026 Aura OS by Spero Systems. All rights reserved.</p>
      </footer>

      {/* Stripe Embedded Checkout Modal */}
      {showCheckout && clientSecret && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md overflow-y-auto p-4 md:p-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-4xl mx-auto mt-10 mb-20 relative shadow-2xl animate-in zoom-in-95 duration-300 min-h-[500px]">
            <button 
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-4 md:p-8 pt-16">
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
