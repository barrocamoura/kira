"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { X, Shield, Zap, Target, Sparkles, ChevronRight, BrainCircuit, Globe, Workflow, Activity } from 'lucide-react';
import dynamic from 'next/dynamic';
const AuraCore = dynamic(() => import('@/components/Kira3D'), { ssr: false });
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function AuraLandingPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      
      {/* Navbar Premium */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-2xl border-b border-slate-200 shadow-sm py-3' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 p-[1px] group-hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 font-black text-lg">A</span>
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">Aura OS</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-500">
            <a href="#vision" className="hover:text-emerald-600 transition">Visão</a>
            <a href="#kira" className="hover:text-emerald-600 transition flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-500"/> Kira AI</a>
            <a href="#features" className="hover:text-emerald-600 transition">Ecossistema</a>
            <a href="#pricing" className="hover:text-emerald-600 transition">Preçário</a>
            <Link href="/login" className="hover:text-emerald-600 transition ml-4">Login</Link>
          </div>
          <Link href="/onboarding" className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-emerald-600 hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] flex items-center gap-2">
            Testar Grátis <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white/50 mb-10 backdrop-blur-md animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-600 tracking-widest uppercase">Kira AI Engine Live</span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-8 max-w-6xl leading-[1.05] animate-fade-in-up text-slate-900" style={{ animationDelay: '100ms' }}>
          O Sistema Operativo <br/>
          <span className="text-emerald-600">do seu Espaço.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mb-12 font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          A domótica tradicional falhou. O Aura OS transforma casas, escritórios e condomínios num ecossistema vivo onde Humanos e Inteligência Artificial trabalham de mãos dadas.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5 w-full justify-center relative z-10 mb-20 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Link href="/onboarding" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-emerald-500 text-white text-lg font-black hover:scale-105 transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2">
            Começar Agora <ChevronRight className="w-5 h-5" />
          </Link>
          <a href="#vision" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 shadow-sm text-lg font-bold transition-colors">
            Descobrir Mais
          </a>
        </div>

        {/* Hero Image / Mockup - ULTRA PREMIUM FLAT DASHBOARD */}
        <div className="relative w-full max-w-6xl mx-auto mt-16 animate-fade-in-up z-20" style={{ animationDelay: '400ms' }}>
          
          <div className="relative w-full aspect-[16/9] rounded-[2rem] bg-white/90 backdrop-blur-3xl border border-slate-200 shadow-2xl flex overflow-hidden ring-1 ring-slate-900/5">
            
            {/* Top Mac-style bar */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-slate-50 border-b border-slate-100 flex items-center px-6 z-20">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              </div>
              <div className="mx-auto text-xs font-bold text-slate-400 tracking-wider">AURA_OS_DASHBOARD_V2.0</div>
            </div>

            {/* Sidebar */}
            <div className="w-64 bg-slate-50 border-r border-slate-100 flex flex-col pt-20 pb-6 px-4 z-10">
              <div className="flex items-center space-x-3 mb-10 px-2">
                <BrainCircuit className="w-6 h-6 text-emerald-500" />
                <span className="text-slate-900 font-black tracking-wider">AURA OS</span>
              </div>
              <div className="space-y-2">
                {[
                  { icon: <Activity className="w-4 h-4" />, label: 'Visão Geral', active: true },
                  { icon: <Zap className="w-4 h-4" />, label: 'Automações' },
                  { icon: <Shield className="w-4 h-4" />, label: 'Segurança' },
                  { icon: <Globe className="w-4 h-4" />, label: 'Rede IoT' },
                  { icon: <Workflow className="w-4 h-4" />, label: 'Integrações' }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center space-x-3 p-3 rounded-xl transition-colors cursor-pointer ${item.active ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 bg-white pt-20 px-10 pb-10 flex flex-col gap-8 z-10">
              
              {/* Header */}
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Visão Geral</h2>
                  <p className="text-slate-500 text-sm">Estado dos sistemas do edifício em tempo real.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    SISTEMA ONLINE
                  </div>
                </div>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { title: 'Eficiência Energética', value: '94%', trend: '+2.4%', trendUp: true, color: 'text-emerald-500' },
                  { title: 'Dispositivos Ativos', value: '1,248', trend: '+12', trendUp: true, color: 'text-emerald-500' },
                  { title: 'Ameaças Bloqueadas', value: '0', trend: 'Seguro', trendUp: true, color: 'text-slate-400' }
                ].map((card, i) => (
                  <div key={i} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <span className="text-sm font-semibold text-slate-500 mb-4">{card.title}</span>
                    <div className="flex items-end justify-between">
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</span>
                      <span className={`text-sm font-bold ${card.color}`}>{card.trend}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Chart Area */}
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 z-10">
                  <h3 className="text-lg font-bold text-slate-900">Consumo nas Últimas 24h</h3>
                  <div className="bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg px-3 py-1 shadow-sm">Hoje</div>
                </div>
                
                {/* Clean SVG Line Chart */}
                <div className="flex-1 relative w-full h-full z-10">
                  <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="premium-gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,30 L0,15 C10,10 20,25 30,20 C40,15 50,5 60,12 C70,19 80,22 90,15 C95,12 100,8 100,8 L100,30 Z" fill="url(#premium-gradient)" />
                    <path d="M0,15 C10,10 20,25 30,20 C40,15 50,5 60,12 C70,19 80,22 90,15 C95,12 100,8 100,8" fill="none" stroke="#10b981" strokeWidth="0.8" />
                    {/* Glowing dots */}
                    <circle cx="30" cy="20" r="1" fill="#10b981" className="animate-pulse" />
                    <circle cx="60" cy="12" r="1" fill="#10b981" className="animate-pulse" />
                    <circle cx="90" cy="15" r="1" fill="#10b981" className="animate-pulse" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* The Problem / Vision - Updated with visual */}
      <section id="vision" className="py-32 px-6 bg-white relative border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight text-slate-900">
              Até hoje, edifícios inteligentes eram complexos, <span className="text-slate-400">caros e limitados.</span>
            </h2>
            <p className="text-xl text-slate-600 font-light leading-relaxed mb-8">
              Painéis confusos, cabos infinitos e sistemas que não comunicam entre si. O Aura OS foi desenhado do zero para centralizar tudo. Crie a planta 3D do seu espaço num editor interativo, ligue os seus sensores IoT em segundos e deixe a nossa IA governar a eficiência energética e segurança.
            </p>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <Shield className="text-emerald-500 w-6 h-6"/>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Target className="text-blue-500 w-6 h-6"/>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative border border-slate-100">
              <Image 
                src="/assets/aura_vision_space.png"
                alt="Aura Vision Space"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Kira AI Section (Hand in Hand) */}
      <section id="kira" className="py-32 px-6 relative overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100/50 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 mb-8">
                <BrainCircuit className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Inteligência Operacional</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] text-slate-900">
                O Humano e a IA,<br/>
                de mãos dadas.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                A nossa assistente IA (Kira) não o substitui; ela capacita-o. Ela aprende as suas rotinas térmicas para poupar na fatura da luz. Avisa proativamente se a porta da garagem ficou aberta. Sugere automações que o humano jamais teria tempo para programar. O poder de decisão final é sempre seu.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                    <Zap className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Eficiência Energética Adaptativa</h4>
                    <p className="text-slate-500 text-sm mt-1">A IA prevê o clima e a ocupação da sala, ajustando o AC antes sequer de sentir frio ou calor, cortando até 35% na fatura.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                    <Shield className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Anomalias de Segurança 24/7</h4>
                    <p className="text-slate-500 text-sm mt-1">Deteta movimento fora do padrão e notifica imediatamente a equipa ou o dono, podendo ativar simulações de presença reais.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* True Kira Component (Aura Core) */}
            <div className="relative w-full mt-10 lg:mt-0">
              <AuraCore />
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Ecosystem Section */}
      <section id="features" className="py-32 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Um Ecossistema Sem Limites</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Design simplificado. Gestão centralizada. O Aura OS integra todos os dispositivos num único hub de controlo, escalável de um apartamento a uma multinacional.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Visual Ecosystem */}
            <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] rounded-[2rem] bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center p-8">
               <Image 
                src="/assets/aura_ecosystem.png"
                alt="Aura Smart Ecosystem"
                fill
                className="object-contain p-4 hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Ecosystem Features */}
            <div className="flex flex-col gap-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <Globe className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-slate-900">Mapeamento 3D Digital Twin</h3>
                <p className="text-slate-600">
                  Desenhe o seu edifício e navegue num motor gráfico em tempo real. Interaja diretamente com os elementos no ecrã.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <Workflow className="w-8 h-8 text-emerald-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-slate-900">Automações No-Code</h3>
                <p className="text-slate-600">
                  Motor lógico visual simples. Arraste e crie regras instantâneas sem escrever uma única linha de código.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl hover:shadow-2xl transition-shadow text-white">
                <h3 className="text-2xl font-bold mb-2">Whitelabel B2B</h3>
                <p className="text-slate-400 mb-4">
                  Soluções exclusivas para imobiliárias e construtoras com a sua própria marca e painel dedicado.
                </p>
                <a href="mailto:vendas@sperosystems.com" className="inline-block px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors">
                  Contactar Vendas
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - High Conversion (White Theme) */}
      <section id="pricing" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900">Investimento que se paga a si mesmo.</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">A poupança energética gerada cobre largamente o valor da subscrição.</p>
          </div>

          <div className="flex justify-center mb-16 relative z-20">
            <div className="bg-white p-1.5 rounded-2xl inline-flex border border-slate-200 items-center shadow-sm">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all ${!isAnnual ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Mensal
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Anual
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ${isAnnual ? 'bg-black/20 text-white font-black' : 'bg-emerald-50 text-emerald-600'}`}>2 meses grátis</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative z-10">
            
            {/* PLANO 1: TRIAL */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col hover:border-slate-300 hover:shadow-md transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-slate-900">Free Trial</h3>
                <p className="text-slate-500 text-sm">Para provar o valor sem risco.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="text-4xl font-black mb-2 text-slate-900">Grátis</div>
                <div className="text-slate-500 font-medium text-sm">Por 15 dias corridos</div>
              </div>
              <ul className="space-y-4 mb-8 text-slate-600 text-sm flex-1 font-medium">
                <li className="flex items-center gap-3"><span className="text-slate-300">✓</span> <span>1 Espaço (Casa)</span></li>
                <li className="flex items-center gap-3"><span className="text-slate-300">✓</span> <span>Kira AI Básica</span></li>
                <li className="flex items-center gap-3"><span className="text-slate-300">✓</span> <span>Máx 10 Equipamentos</span></li>
              </ul>
              <Link href="/onboarding" className="w-full py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-center transition">
                Iniciar Trial
              </Link>
            </div>

            {/* PLANO 2: HOME */}
            <div className="p-8 rounded-3xl bg-white border-2 border-emerald-500 relative flex flex-col transform md:-translate-y-4 shadow-xl shadow-emerald-500/10 group">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-emerald-500 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                O Mais Escolhido
              </div>
              <div className="mb-8 mt-2">
                <h3 className="text-2xl font-black mb-2 text-emerald-600">Aura Home</h3>
                <p className="text-slate-500 text-sm">Para residências de luxo e famílias.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="text-5xl font-black mb-2 flex items-baseline gap-1 text-slate-900">
                  €{isAnnual ? '190' : '19'}
                  <span className="text-lg text-slate-500 font-medium">/{isAnnual ? 'ano' : 'mês'}</span>
                </div>
                <div className="text-emerald-600 text-sm font-semibold">Cancela quando quiseres</div>
              </div>
              <ul className="space-y-4 mb-8 text-slate-700 text-sm flex-1 font-medium">
                <li className="flex items-center gap-3"><span className="text-emerald-500 text-lg">✓</span> <span>Equipamentos Ilimitados</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-500 text-lg">✓</span> <span>Kira Automations e Cenas</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-500 text-lg">✓</span> <span>Acesso Familiar Total</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-500 text-lg">✓</span> <span>Modo Kiosk Tablet</span></li>
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
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-center transition-all shadow-md shadow-emerald-500/20 relative z-20"
              >
                Subscrever Home
              </button>
            </div>

            {/* PLANO 3: ENTERPRISE */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col hover:border-slate-300 hover:shadow-md transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-blue-600">Aura Enterprise</h3>
                <p className="text-slate-500 text-sm">Para escritórios e PMEs.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="text-4xl font-black mb-2 flex items-baseline gap-1 text-slate-900">
                  €{isAnnual ? '1000' : '100'}
                  <span className="text-lg text-slate-500 font-normal">/{isAnnual ? 'ano' : 'mês'}</span>
                </div>
                <div className="text-slate-500 text-sm font-medium">Até 10 Espaços B2B</div>
              </div>
              <ul className="space-y-4 mb-8 text-slate-600 text-sm flex-1 font-medium">
                <li className="flex items-center gap-3"><span className="text-slate-300">✓</span> <span>Multi-Tenant</span></li>
                <li className="flex items-center gap-3"><span className="text-slate-300">✓</span> <span>Controlo Acessos de Staff</span></li>
                <li className="flex items-center gap-3"><span className="text-slate-300">✓</span> <span>Relatórios Fiscais Energia</span></li>
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
                className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center transition"
              >
                Subscrever Enterprise
              </button>
            </div>

            {/* PLANO 4: WHITELABEL */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-[40px] rounded-full pointer-events-none" />
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-bold mb-2 text-amber-400">Whitelabel B2B</h3>
                <p className="text-slate-400 text-sm">A solução definitiva para Imobiliárias.</p>
              </div>
              <div className="mb-8 flex-1 relative z-10">
                <div className="text-3xl font-black mb-2 text-white">Sob Consulta</div>
                <div className="text-slate-400 text-sm font-medium">Contratos de larga escala</div>
              </div>
              <ul className="space-y-4 mb-8 text-slate-300 text-sm flex-1 relative z-10 font-medium">
                <li className="flex items-center gap-3"><span className="text-slate-600">✓</span> <span>A sua Marca (Cores + Logo)</span></li>
                <li className="flex items-center gap-3"><span className="text-slate-600">✓</span> <span>Edifícios Ilimitados</span></li>
                <li className="flex items-center gap-3"><span className="text-slate-600">✓</span> <span>SLA e Suporte Dedicado</span></li>
              </ul>
              <a href="mailto:vendas@sperosystems.com" className="w-full py-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-center transition relative z-10 block">
                Contactar Especialista
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 text-center text-slate-500 text-sm bg-white">
        <p className="mb-2 font-medium">Desenhado para o Futuro.</p>
        <p>© 2026 Aura OS by Spero Systems. All rights reserved.</p>
      </footer>

      {/* Stripe Embedded Checkout Modal */}
      {showCheckout && clientSecret && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm overflow-y-auto p-4 md:p-8 animate-in fade-in duration-300">
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
