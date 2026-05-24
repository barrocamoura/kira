"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, LogIn } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Chaves Supabase em falta.");

      // Apenas Login! O registo é feito pelo Funil de Trial (/onboarding)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Verifica se o user já completou o onboarding (se tem um espaço)
      const { data: spaces } = await supabase
        .from('spaces')
        .select('id')
        .eq('owner_id', data.user.id)
        .limit(1);
        
      // Redireciona de acordo com o status
      // Mesmo no login normal, redireciona para root se for superadmin. O middleware deixará passar.
      const { data: userData } = await supabase
        .from('users')
        .select('is_superadmin')
        .eq('id', data.user.id)
        .maybeSingle();

      if (userData?.is_superadmin) {
        router.push('/root');
      } else if (spaces && spaces.length > 0) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl animate-in slide-in-from-bottom-8 duration-700 fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Aura OS</h1>
          <p className="text-white/50 text-sm mt-2 uppercase tracking-widest font-bold">Acesso à Plataforma</p>
        </div>
        
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50 uppercase font-bold tracking-widest">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nome@empresa.com"
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50 uppercase font-bold tracking-widest">Palavra-passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !email || !password}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "A Validar..." : "Entrar no Sistema"}
            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-white/50">Ainda não é cliente?</p>
          <Link href="/onboarding" className="mt-2 inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold transition">
            <Sparkles className="w-4 h-4" /> Iniciar Teste Grátis de 15 Dias
          </Link>
        </div>
      </div>
    </div>
  );
}
