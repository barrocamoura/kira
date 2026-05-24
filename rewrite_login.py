import os

content = """\"use client\";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, UserPlus, LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isSignUp && !fullName) return;
    
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      if (!supabase) throw new Error("Chaves Supabase em falta.");

      if (isSignUp) {
        // Registo
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        
        if (error) throw error;
        
        // Registo com sucesso - Em modo de demonstração sem confirmação de email
        // ele faz login automaticamente e redereciona
        router.push('/onboarding');
      } else {
        // Login
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
          
        if (spaces && spaces.length > 0) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
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
          <p className="text-white/50 text-sm mt-2 uppercase tracking-widest font-bold">Portal de Acesso Seguro</p>
        </div>
        
        {/* Toggle Modo */}
        <div className="flex p-1 bg-black/40 rounded-xl mb-6 border border-white/5">
          <button 
            type="button"
            onClick={() => {setIsSignUp(false); setErrorMsg('');}}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${!isSignUp ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-white/50 hover:text-white'}`}
          >
            <LogIn className="w-4 h-4" /> Entrar
          </button>
          <button 
            type="button"
            onClick={() => {setIsSignUp(true); setErrorMsg('');}}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${isSignUp ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-white/50 hover:text-white'}`}
          >
            <UserPlus className="w-4 h-4" /> Criar Conta
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-5">
          
          {isSignUp && (
            <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 fade-in">
              <label className="text-xs text-white/50 uppercase font-bold tracking-widest">Nome Completo</label>
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Seu Nome"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>
            </div>
          )}

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
            disabled={isLoading || !email || !password || (isSignUp && !fullName)}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "A Processar..." : (isSignUp ? "Criar Conta Segura" : "Entrar no Sistema")}
            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="text-center text-xs text-white/30 mt-8">
          Acesso reservado a clientes integradores e arquitetos. <br/> Protegido por criptografia AES-256.
        </p>
      </div>
    </div>
  );
}
"""

with open("src/app/login/page.tsx", "w") as f:
    f.write(content)
