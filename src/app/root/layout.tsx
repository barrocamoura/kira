import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Ticket, Settings, LogOut, ShieldAlert } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-300">
      
      {/* Root Sidebar */}
      <aside className="w-64 bg-black border-r border-slate-800 flex flex-col relative z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight leading-none">Aura Root</h1>
            <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mt-1">Superadmin</p>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/root" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-sm font-medium">
            <LayoutDashboard className="w-5 h-5 text-slate-500" /> Financial Hub
          </Link>
          <Link href="/root/tickets" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-sm font-medium">
            <Ticket className="w-5 h-5 text-slate-500" /> Helpdesk (Care)
          </Link>
          <Link href="/root/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-sm font-medium">
            <Users className="w-5 h-5 text-slate-500" /> Clientes & Espaços
          </Link>
          <Link href="/root/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-sm font-medium">
            <Settings className="w-5 h-5 text-slate-500" /> Platform Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-sm font-medium text-red-400 hover:text-red-300">
            <LogOut className="w-5 h-5" /> Sair do Root
          </Link>
        </div>
      </aside>

      {/* Root Main Content */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        
        <header className="h-16 border-b border-slate-800 bg-black/50 backdrop-blur-md flex items-center px-8 relative z-10 justify-between">
          <div className="text-sm font-semibold text-slate-400">
            Acesso Restrito - Todas as ações são auditadas
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Sistemas Operacionais</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          {children}
        </div>
      </main>

    </div>
  );
}
