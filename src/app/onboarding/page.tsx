"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, ArrowRight, Building, Home, Phone, User, CheckCircle2, ShieldAlert, Mail, Lock } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { submitOnboarding } from '@/app/actions/workspace';

export default function Onboarding() {
  const [planType, setPlanType] = useState('home');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [spaceName, setSpaceName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleTrialSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !phone || !spaceName) {
      setErrorMsg("Por favor, preencha todos os campos.");
      return;
    }
    
    setErrorMsg('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      // 1. Criar o User no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          // Ignorar email de verificação em ambiente de teste
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (authError) throw authError;

      // 2. Chamar a Server Action para criar o Espaço (pois agora já há sessão)
      const formData = new FormData();
      formData.append('phone', phone);
      formData.append('spaceName', spaceName);
      formData.append('planType', planType);
      
      const result = await submitOnboarding(formData);
      
      if (result?.error) {
        throw new Error(result.error);
      }

      // Tudo certo! Vamos para a dashboard
      router.push('/dashboard');

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Ocorreu um erro ao preparar o seu Trial.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden py-12">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-3xl px-6 relative z-10">
        
        {/* Saudação da IA */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-blue-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <Bot className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Comece o seu Teste Grátis</h1>
          <p className="text-white/60 text-lg max-w-xl">
            Crie a sua conta segura e configure a sua Casa ou Empresa Inteligente em menos de 1 minuto.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleTrialSignup} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          
          <h3 className="text-xl font-bold mb-6 text-white/90">1. Credenciais de Acesso Seguras</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-sm font-medium text-white/70 block mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" /> Nome Completo
              </label>
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Ex: Alessandro Moura" 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 block mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" /> E-mail
              </label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nome@empresa.com" 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 block mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" /> Palavra-passe
              </label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 block mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" /> Telemóvel
              </label>
              <input 
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+351 912 345 678" 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

          <h3 className="text-xl font-bold mb-6 text-white/90">2. Qual espaço vamos automatizar?</h3>
          
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
              value={spaceName}
              onChange={e => setSpaceName(e.target.value)}
              placeholder={planType === 'home' ? "Ex: Residência Moura" : "Ex: Spero Systems HQ"} 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-emerald-400">15 Dias de Garantia</div>
              <p className="text-xs text-white/60 mt-1">Ao avançar, o seu motor 3D e as funcionalidades de IA (Kira) serão ativados gratuitamente. Após 15 dias, você poderá escolher o plano definitivo no Dashboard.</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            {isLoading ? 'A preparar Cérebro IA...' : 'Iniciar Teste Grátis no Aura OS'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/30">
          <ShieldAlert className="w-4 h-4" /> Criptografia de Ponta a Ponta Ativada (Arquitetura Kira)
        </div>
      </div>
    </main>
  );
}
