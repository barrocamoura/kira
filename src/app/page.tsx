"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { X, Shield, Zap, Home as HomeIcon, Smartphone } from 'lucide-react';

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      
      {/* Navbar Premium */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3' : 'bg-transparent border-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center">
              <span className="text-black font-black text-xl">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Aura OS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#benefits" className="hover:text-white transition">Benefícios</a>
            <a href="#features" className="hover:text-white transition">Funcionalidades</a>
            <a href="#pricing" className="hover:text-white transition">Planos</a>
            <Link href="/login" className="hover:text-white transition">Login</Link>
          </div>
          <Link href="/onboarding" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 transition shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Testar Grátis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-white/80">Kira AI Engine v2.0 Live</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 max-w-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 leading-[1.1]">
          O seu edifício,<br />finalmente inteligente.
        </h1>
        
        <p className="text-xl md:text-2xl text-white/50 max-w-2xl mb-12 font-light leading-relaxed">
          Planta 3D interativa em tempo real. Automações sem código. Tudo o que precisa para transformar um espaço comum num ambiente do futuro.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center relative z-10">
          <Link href="/onboarding" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black text-lg font-bold hover:scale-105 transition-transform shadow-[0_0_40px_rgba(52,211,153,0.3)]">
            Começar 15 Dias Grátis
          </Link>
          <a href="#pricing" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-lg font-bold transition-colors">
            Ver Preços
          </a>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Porquê o Aura OS?</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Não é apenas uma App. É uma revolução na forma como interage com a sua casa ou empresa.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-[#111] border border-white/5">
              <Zap className="w-10 h-10 text-yellow-400 mb-6" />
              <h3 className="text-xl font-bold mb-3">Poupança Brutal</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                As nossas automações de energia garantem que as luzes e o AC desligam automaticamente quando não há ninguém na divisão. Poupe até 40% na fatura.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-[#111] border border-white/5">
              <Shield className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-xl font-bold mb-3">Segurança 24/7</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Tranque portas remotamente. Receba alertas imediatos se houver movimento suspeito. Simule presença quando for de férias.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#111] border border-white/5">
              <HomeIcon className="w-10 h-10 text-cyan-400 mb-6" />
              <h3 className="text-xl font-bold mb-3">Conforto Absoluto</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Acorde com a casa já quente e os estores a abrir suavemente com o nascer do sol. A Kira (IA) aprende a sua rotina e faz tudo por si.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#111] border border-white/5">
              <Smartphone className="w-10 h-10 text-fuchsia-400 mb-6" />
              <h3 className="text-xl font-bold mb-3">Controlo Remoto</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Esteja nas Maldivas ou no trabalho, veja a planta 3D da sua casa em tempo real, gerindo todos os sensores e câmaras pelo telemóvel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="py-32 px-6 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Controlo Total na Nuvem</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Esqueça os painéis complexos. Com o Aura OS, desenha a sua casa em 2D, e nós geramos o motor 3D automaticamente.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-[#111] border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <span className="text-2xl">📐</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Blueprint 2D/3D</h3>
              <p className="text-white/50 leading-relaxed">Desenhe as divisões e coloque as luzes num editor intuitivo. Tudo sincronizado em tempo real.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#111] border border-white/5 hover:border-cyan-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Kira Automations</h3>
              <p className="text-white/50 leading-relaxed">Crie regras complexas (ex: Se detetar movimento, liga a luz vermelha) sem escrever uma única linha de código.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#111] border border-white/5 hover:border-purple-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Painel Kiosk</h3>
              <p className="text-white/50 leading-relaxed">Transforme um Tablet velho num painel de controlo de parede ultra moderno com widgets personalizáveis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Planos que Escalem Consigo</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Comece gratuitamente, atualize quando necessitar.</p>
          </div>

          <div className="flex justify-center mb-16">
            <div className="bg-[#111] p-1.5 rounded-2xl inline-flex border border-white/10 items-center">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${!isAnnual ? 'bg-emerald-500 text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
              >
                Mensal
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-emerald-500 text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
              >
                Anual
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ${isAnnual ? 'bg-black/20' : 'bg-emerald-500/20 text-emerald-400'}`}>2 meses grátis</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            
            {/* PLANO 1: TRIAL */}
            <div className="p-8 rounded-3xl bg-[#111] border border-white/5 flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Trial</h3>
                <p className="text-white/40 text-sm">Apenas para testar.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="text-4xl font-black mb-2">Grátis</div>
                <div className="text-emerald-400 font-medium">Por 15 dias</div>
              </div>
              <ul className="space-y-4 mb-8 text-white/70 text-sm flex-1">
                <li className="flex items-center gap-3">✓ <span>1 Espaço (Casa)</span></li>
                <li className="flex items-center gap-3">✓ <span>Máx 10 Equipamentos</span></li>
              </ul>
              <Link href="/onboarding" className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-center transition">
                Começar
              </Link>
            </div>

            {/* PLANO 2: HOME */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1a231f] to-[#0a110e] border border-emerald-500/30 relative flex flex-col transform md:-translate-y-4 shadow-[0_20px_40px_rgba(16,185,129,0.1)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full uppercase tracking-wider">
                Recomendado
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-emerald-400">Aura Home</h3>
                <p className="text-white/40 text-sm">Para residentes exigentes.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="text-4xl font-black mb-2 flex items-end">
                  €{isAnnual ? '190' : '19'}
                  <span className="text-lg text-white/30 font-normal mb-1">/{isAnnual ? 'ano' : 'mês'}</span>
                </div>
                <div className="text-white/50 text-sm">Cobrado {isAnnual ? 'anualmente' : 'mensalmente'}</div>
              </div>
              <ul className="space-y-4 mb-8 text-white/90 text-sm flex-1">
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> <span>Equipamentos Ilimitados</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> <span>Kira Automations</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> <span>Sincronização Cloud</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> <span>Kiosk Mode</span></li>
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
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-center transition shadow-lg shadow-emerald-500/20"
              >
                Subscrever Home
              </button>
            </div>

            {/* PLANO 3: ENTERPRISE */}
            <div className="p-8 rounded-3xl bg-[#111] border border-white/5 flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-indigo-400">Aura Enterprise</h3>
                <p className="text-white/40 text-sm">Para Gestores e Edifícios B2B.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="text-4xl font-black mb-2 flex items-end">
                  €{isAnnual ? '1000' : '100'}
                  <span className="text-lg text-white/30 font-normal mb-1">/{isAnnual ? 'ano' : 'mês'}</span>
                </div>
                <div className="text-white/50 text-sm">Até 10 Edifícios / Espaços</div>
              </div>
              <ul className="space-y-4 mb-8 text-white/70 text-sm flex-1">
                <li className="flex items-center gap-3">✓ <span>Multi-Tenant (Espaços infinitos)</span></li>
                <li className="flex items-center gap-3">✓ <span>Gestão de Técnicos (RBAC)</span></li>
                <li className="flex items-center gap-3">✓ <span>API Dedicada</span></li>
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
                className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-center transition"
              >
                Subscrever Enterprise
              </button>
            </div>

            {/* PLANO 4: WHITELABEL */}
            <div className="p-8 rounded-3xl bg-[#111] border border-white/5 flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-amber-400">Whitelabel</h3>
                <p className="text-white/40 text-sm">Construtoras e Marcas Próprias.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="text-3xl font-black mb-2">Sob Consulta</div>
                <div className="text-white/50 text-sm">Contratos Customizados</div>
              </div>
              <ul className="space-y-4 mb-8 text-white/70 text-sm flex-1">
                <li className="flex items-center gap-3">✓ <span>App com a sua Marca e Logo</span></li>
                <li className="flex items-center gap-3">✓ <span>Integração de Faturação</span></li>
                <li className="flex items-center gap-3">✓ <span>Suporte SLA 24/7</span></li>
              </ul>
              <a href="mailto:vendas@sperosystems.com" className="w-full py-4 rounded-xl border border-white/20 hover:bg-white hover:text-black text-white font-bold text-center transition block">
                Falar com Vendas
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-white/30 text-sm">
        <p>© 2026 Aura OS by Spero Systems. All rights reserved.</p>
      </footer>

      {/* Stripe Embedded Checkout Modal */}
      {showCheckout && clientSecret && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm overflow-y-auto p-4 md:p-8">
          <div className="bg-white rounded-3xl w-full max-w-4xl mx-auto mt-10 mb-20 relative shadow-2xl animate-in zoom-in-95 duration-300 min-h-[500px]">
            <button 
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-4 md:p-8">
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
