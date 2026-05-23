"use client";

import React, { useState } from 'react';
import { Bot, ArrowRight, Building, Home, Phone, User, CheckCircle2, ShieldAlert } from 'lucide-react';
import { submitOnboarding } from '@/app/actions/workspace';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
    >
      {pending ? 'Configurando IA...' : 'Entrar no Kira OS (Iniciar Trial)'}
      {!pending && <ArrowRight className="w-5 h-5" />}
    </button>
  );
}

export default function Onboarding() {
  const [planType, setPlanType] = useState('home');

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden py-12">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl px-6 relative z-10">
        
        {/* Saudação da IA */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-blue-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <Bot className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Olá, eu sou a Kira.</h1>
          <p className="text-white/60 text-lg max-w-lg">
            Sua conta de acesso seguro foi criada. Agora, eu preciso te conhecer melhor para configurar a Inteligência Artificial do seu espaço.
          </p>
        </div>

        {/* Formulário de Onboarding (Server Action) */}
        <form action={submitOnboarding} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <input type="hidden" name="planType" value={planType} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-sm font-medium text-white/70 block mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Nome Completo
              </label>
              <input 
                type="text" 
                name="fullName"
                placeholder="Ex: Alessandro Moura" 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 block mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Telemóvel / WhatsApp
              </label>
              <input 
                type="tel" 
                name="phone"
                placeholder="+351 912 345 678" 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
              <p className="text-[10px] text-white/40 mt-1">Usaremos para alertas de segurança de intrusão.</p>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

          <h3 className="text-xl font-bold mb-4">Qual espaço vamos automatizar?</h3>
          
          {/* Seleção do Tipo de Plano (UI Visual) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div 
              onClick={() => setPlanType('home')}
              className={`cursor-pointer p-4 rounded-2xl border transition-all ${planType === 'home' ? 'bg-blue-500/20 border-blue-500 shadow-inner' : 'bg-black/40 border-white/10 hover:bg-white/5'}`}
            >
              <Home className={`w-6 h-6 mb-2 ${planType === 'home' ? 'text-blue-400' : 'text-white/50'}`} />
              <div className="font-semibold text-sm">Residencial</div>
              <div className="text-xs text-white/50 mt-1">Casa ou Apartamento</div>
            </div>
            
            <div 
              onClick={() => setPlanType('enterprise')}
              className={`cursor-pointer p-4 rounded-2xl border transition-all ${planType === 'enterprise' ? 'bg-purple-500/20 border-purple-500 shadow-inner' : 'bg-black/40 border-white/10 hover:bg-white/5'}`}
            >
              <Building className={`w-6 h-6 mb-2 ${planType === 'enterprise' ? 'text-purple-400' : 'text-white/50'}`} />
              <div className="font-semibold text-sm">Empresarial</div>
              <div className="text-xs text-white/50 mt-1">Escritório ou Prédio</div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white/70 block mb-2">Nome do seu Espaço (Workspace)</label>
            <input 
              type="text" 
              name="spaceName"
              placeholder={planType === 'home' ? "Ex: Residência Moura" : "Ex: Spero Systems HQ"} 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Alerta de Trial */}
          <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-emerald-400">15 Dias de Garantia</div>
              <p className="text-xs text-white/60 mt-1">Ao avançar, o seu motor 3D e as funcionalidades de IA (Kira) serão ativados gratuitamente. Após 15 dias, você poderá escolher o plano definitivo no Dashboard.</p>
            </div>
          </div>

          <SubmitButton />
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/30">
          <ShieldAlert className="w-4 h-4" /> Criptografia de Ponta a Ponta Ativada (Arquitetura Kira)
        </div>
      </div>
    </main>
  );
}
