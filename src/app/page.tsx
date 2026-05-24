"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { X } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function AuraLandingPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      
      {/* Navbar Premium */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center">
              <span className="text-black font-black text-xl">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Aura OS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
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
          Planta 3D interativa em tempo real. Automações sem código. Inteligência Artificial integrada. Tudo o que precisa para gerir espaços B2C ou complexos B2B.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link href="/onboarding" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black text-lg font-bold hover:scale-105 transition-transform shadow-[0_0_40px_rgba(52,211,153,0.3)]">
            Começar 15 Dias Grátis
          </Link>
          <a href="#pricing" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-lg font-bold transition-colors">
            Ver Preços
          </a>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="py-32 px-6 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Controlo Total na Nuvem</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Esqueça os painéis complexos. Com o Aura OS, desenha a sua casa em 2D, e nós geramos o motor 3D automaticamente com os seus sensores ao vivo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-[#111] border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <span className="text-2xl">📐</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Blueprint 2D/3D</h3>
              <p className="text-white/50 leading-relaxed">Desenhe as divisões e coloque as luzes num editor intuitivo. Tudo sincronizado com o Supabase.</p>
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
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-bold mb-3">B2B Whitelabel</h3>
              <p className="text-white/50 leading-relaxed">Construtoras podem injetar a sua própria marca, cores e logótipos para entregar casas Premium aos clientes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Motor de Vendas) */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Planos que Escalem Consigo</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Desde a sua casa até dezenas de condomínios.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* PLANO 1: TRIAL */}
            <div className="p-8 rounded-3xl bg-[#111] border border-white/5 flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Aura Trial</h3>
                <p className="text-white/40 text-sm">Perfeito para descobrir o potencial.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="text-5xl font-black mb-2">Grátis</div>
                <div className="text-emerald-400 font-medium">Durante 15 dias</div>
              </div>
              <ul className="space-y-4 mb-8 text-white/70 text-sm">
                <li className="flex items-center gap-3">✓ <span>1 Espaço (Casa)</span></li>
                <li className="flex items-center gap-3">✓ <span>Editor Blueprint 3D</span></li>
                <li className="flex items-center gap-3">✓ <span>Máx 10 Equipamentos</span></li>
              </ul>
              <Link href="/onboarding" className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-center transition">
                Testar Grátis
              </Link>
            </div>

            {/* PLANO 2: HOME (Motor Stripe) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1a231f] to-[#0a110e] border border-emerald-500/30 relative flex flex-col transform md:-translate-y-4 shadow-[0_20px_40px_rgba(16,185,129,0.1)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full uppercase tracking-wider">
                Recomendado
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-emerald-400">Aura Home</h3>
                <p className="text-white/40 text-sm">Para residentes que querem a casa do futuro.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="text-5xl font-black mb-2">€19<span className="text-lg text-white/30 font-normal">/mês</span></div>
                <div className="text-white/50 text-sm">Cobrado mensalmente via Stripe</div>
              </div>
              <ul className="space-y-4 mb-8 text-white/90 text-sm">
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> <span>Equipamentos Ilimitados</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> <span>Kira Automations (Ilimitadas)</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> <span>Sincronização Cloud Real-time</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> <span>Suporte Prioritário</span></li>
              </ul>
              
              <button 
                onClick={async () => {
                  try {
                    const res = await fetch('/api/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ plan: 'home' })
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
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-center transition"
              >
                Subscrever Agora
              </button>
            </div>

            {/* PLANO 3: ENTERPRISE */}
            <div className="p-8 rounded-3xl bg-[#111] border border-white/5 flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Aura Enterprise</h3>
                <p className="text-white/40 text-sm">Para Construtoras e Instaladores.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="text-4xl font-black mb-2">Sob Medida</div>
                <div className="text-white/50 text-sm">Contacte as Vendas</div>
              </div>
              <ul className="space-y-4 mb-8 text-white/70 text-sm">
                <li className="flex items-center gap-3">✓ <span>Casas Ilimitadas (Multi-Tenant)</span></li>
                <li className="flex items-center gap-3">✓ <span>Painel Whitelabel (A sua marca)</span></li>
                <li className="flex items-center gap-3">✓ <span>Acesso para Técnicos (RBAC)</span></li>
                <li className="flex items-center gap-3">✓ <span>Integrações API Dedicadas</span></li>
              </ul>
              <a href="mailto:vendas@sperosystems.com" className="w-full py-4 rounded-xl bg-white hover:bg-white/90 text-black font-bold text-center transition block">
                Contactar Vendas
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="h-full overflow-y-auto p-4 md:p-8">
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
