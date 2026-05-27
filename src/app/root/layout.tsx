import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Ticket, Settings, LogOut, ShieldAlert, LineChart, Server, Briefcase, Activity } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex font-sans text-slate-300 overflow-hidden">
      
      {/* C-Suite Sidebar */}
      <aside className="w-72 bg-[#050505] border-r border-slate-900 flex flex-col relative z-20 shadow-2xl">
        <div className="p-8 border-b border-slate-900 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center relative z-10">
            <ShieldAlert className="w-5 h-5 text-blue-500" />
          </div>
          <div className="relative z-10">
            <h1 className="text-xl font-black text-white tracking-tight leading-none">OLYMPUS</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">C-Suite Command</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-6 overflow-y-auto">
          {/* DEPARTMENTS */}
          <div>
            <div className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Executivo</div>
            <Link href="/root" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-sm font-medium text-white">
              <LayoutDashboard className="w-5 h-5 text-indigo-500" /> CEO Overview
            </Link>
            <Link href="/root/finance" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-sm font-medium text-slate-400 hover:text-white">
              <LineChart className="w-5 h-5 text-emerald-500" /> CFO Finance Hub
            </Link>
          </div>

          <div>
            <div className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Tecnologia & Dados</div>
            <Link href="/root/telemetry" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-sm font-medium text-slate-400 hover:text-white">
              <Server className="w-5 h-5 text-cyan-500" /> CTO Telemetry
            </Link>
          </div>

          <div>
            <div className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Pessoas & Receita</div>
            <Link href="/root/hr" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-sm font-medium text-slate-400 hover:text-white">
              <Users className="w-5 h-5 text-fuchsia-500" /> CHRO Human Resources
            </Link>
            <Link href="/root/clients" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-sm font-medium text-slate-400 hover:text-white">
              <Activity className="w-5 h-5 text-indigo-400" /> CRO Client Hub
            </Link>
          </div>

          <div>
            <div className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Operações (Tech Team)</div>
            <Link href="/root/operations" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-sm font-medium text-slate-400 hover:text-white">
              <Briefcase className="w-5 h-5 text-amber-500" /> COO Helpdesk
            </Link>
          </div>
          
          <div>
            <div className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Sistema</div>
            <Link href="/root/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-sm font-medium text-slate-400 hover:text-white">
              <Settings className="w-5 h-5 text-slate-600" /> Settings
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-900 bg-[#020202]">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition text-sm font-bold text-slate-500 hover:text-red-400">
            <LogOut className="w-5 h-5" /> Sair do Olympus
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden bg-[#020202]">
        
        {/* Top Header */}
        <header className="h-20 border-b border-slate-900/50 bg-[#050505]/80 backdrop-blur-md flex items-center px-10 relative z-30 justify-between">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" /> All Systems Nominal
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Live Sync</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
              AM
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
          {children}
        </div>
      </main>

    </div>
  );
}
