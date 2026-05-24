"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Sparkles, LayoutDashboard, Box, Workflow, Settings, LogOut, Home, Building, LifeBuoy } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router]);

  if (!mounted || !user) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono tracking-widest text-xs uppercase">A verificar credenciais de acesso...</div>;
  }
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/50 p-6 flex flex-col backdrop-blur-xl">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter mb-12">
          <Sparkles className="w-6 h-6 text-blue-400" />
          KIRA OS
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <div className="text-xs font-semibold text-white/40 mb-2 mt-4 uppercase tracking-wider">Geral</div>
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600/10 text-blue-400 font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Visão Geral
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition">
            <Home className="w-5 h-5" />
            Meus Ambientes
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition">
            <Box className="w-5 h-5" />
            Construtor 3D
          </a>
          
          <div className="text-xs font-semibold text-white/40 mb-2 mt-8 uppercase tracking-wider">Inteligência</div>
          <a href="/dashboard/automations" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition">
            <Workflow className="w-5 h-5" />
            Automações & Cenas
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition">
            <Building className="w-5 h-5" />
            Gestão Enterprise
          </a>

          <div className="text-xs font-semibold text-white/40 mb-2 mt-8 uppercase tracking-wider">Conta & Suporte</div>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition">
            <Settings className="w-5 h-5" />
            Configurações
          </a>
          <a href="/dashboard/support" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition">
            <LifeBuoy className="w-5 h-5 text-emerald-400" />
            Aura Care (Suporte)
          </a>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/10">
          <button onClick={async () => { 
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push('/login'); 
          }} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/50 hover:text-red-400 transition w-full text-left">
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Subtle Background Glows for the Dashboard */}
        <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        {/* Top Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 relative z-10 backdrop-blur-sm">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
