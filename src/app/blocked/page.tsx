"use client";

import React from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ShieldAlert, LogOut } from 'lucide-react';

export default function BlockedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-red-500/20 p-8 rounded-3xl text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[50px] rounded-full pointer-events-none" />
        
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-black text-white mb-2">Conta Suspensa</h1>
        <p className="text-slate-400 mb-8 text-sm leading-relaxed">
          O acesso à sua conta Aura OS encontra-se temporariamente suspenso. Isto pode dever-se a uma fatura em atraso ou a uma violação dos nossos termos de serviço.
        </p>

        <a href="mailto:support@aura-os.com" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl transition flex justify-center items-center mb-4">
          Contactar Suporte
        </a>
        
        <button 
          onClick={handleLogout}
          className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-3 px-4 rounded-xl transition flex justify-center items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sair da Conta
        </button>
      </div>
    </div>
  );
}
