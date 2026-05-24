"use client";

import React, { useEffect, useState } from 'react';
import { Server, Activity, Database, ShieldAlert, Cpu, HardDrive, Wifi, ShieldCheck } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export default function CTODashboard() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Simulating terminal logs
    const interval = setInterval(() => {
      const messages = [
        "Connection established to edge node [EU-WEST-1]",
        "Ping: 24ms, Jitter: 2ms",
        "Firewall rule #4401 evaluated. Status: PASS",
        "Syncing auth tokens with public.users...",
        "Kiosk metrics stream active. Packets/sec: 1402",
        "Database query optimized. Execution time: 14ms"
      ];
      setLogs(prev => {
        const newLogs = [...prev, `[${new Date().toISOString().split('T')[1].split('.')[0]}] SYS_OK: ${messages[Math.floor(Math.random() * messages.length)]}`];
        return newLogs.slice(-10); // keep last 10
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const dataCpu = [{ name: 'CPU', value: 34, fill: '#3b82f6' }];
  const dataRam = [{ name: 'RAM', value: 68, fill: '#8b5cf6' }];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-3">
            <Server className="w-8 h-8 text-cyan-500" />
            Telemetry & Data
          </h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-bold">Office of the CTO</p>
        </div>
        <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Network Secure</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CPU RADIAL */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center relative">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest absolute top-6 left-6">Global CPU Load</div>
          <div className="h-32 w-32 mt-6 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="80%" outerRadius="100%" barSize={10} data={dataCpu} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white">34%</div>
          </div>
        </div>

        {/* RAM RADIAL */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center relative">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest absolute top-6 left-6">Memory (RAM)</div>
          <div className="h-32 w-32 mt-6 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="80%" outerRadius="100%" barSize={10} data={dataRam} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white">68%</div>
          </div>
        </div>

        {/* STATS */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
           <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl flex flex-col justify-center">
             <Database className="w-6 h-6 text-indigo-400 mb-4" />
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">DB Read Latency</div>
             <div className="text-3xl font-black text-white">14<span className="text-sm text-slate-500 ml-1">ms</span></div>
           </div>
           <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl flex flex-col justify-center">
             <Wifi className="w-6 h-6 text-blue-400 mb-4" />
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Edge Nodes</div>
             <div className="text-3xl font-black text-white">1,402</div>
           </div>
        </div>
      </div>

      {/* TERMINAL & MAP AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TERMINAL */}
        <div className="lg:col-span-2 bg-[#020202] border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-4 text-xs font-mono text-slate-500">root@olympus-core:~</span>
          </div>
          <div className="flex-1 font-mono text-xs text-emerald-400 leading-loose flex flex-col justify-end">
            {logs.map((log, i) => (
              <div key={i} className="opacity-80">{log}</div>
            ))}
            <div className="flex items-center gap-2 mt-2 text-white">
              <span className="text-emerald-500">➜</span> <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>

        {/* SERVER CLUSTER STATUS */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Cluster Status</h3>
          <div className="space-y-4">
            {[
              { id: 'EU-WEST-1 (London)', status: 'nominal', load: 45 },
              { id: 'EU-SOUTH-1 (Lisbon)', status: 'nominal', load: 82 },
              { id: 'US-EAST-1 (N. Virginia)', status: 'nominal', load: 30 },
              { id: 'US-WEST-1 (N. California)', status: 'offline', load: 0 },
            ].map(node => (
              <div key={node.id} className="p-4 rounded-2xl bg-black/40 border border-slate-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-white">{node.id}</span>
                  <div className={`w-2 h-2 rounded-full ${node.status === 'nominal' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${node.status === 'nominal' ? 'bg-cyan-500' : 'bg-transparent'}`} style={{ width: `${node.load}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
