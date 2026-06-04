"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Radio, Cpu, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function TelemetryDashboard() {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [action, setAction] = useState<string>('turn_on');
  const [log, setLog] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchSpaces = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('spaces').select('id, name');
      if (data) setSpaces(data);
    };
    fetchSpaces();
  }, []);

  useEffect(() => {
    const fetchDevices = async () => {
      if (!selectedSpace) return;
      const supabase = createClient();
      const { data } = await supabase.from('devices').select('id, name, type').eq('space_id', selectedSpace);
      if (data) setDevices(data);
    };
    fetchDevices();
  }, [selectedSpace]);

  const sendWebhook = async () => {
    if (!selectedDevice) return;
    setIsSending(true);
    
    const payload = {
      deviceId: selectedDevice,
      action: action
    };

    try {
      const res = await fetch('/api/iot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      
      const timestamp = new Date().toLocaleTimeString();
      if (res.ok) {
        setLog(prev => [`[${timestamp}] SUCESSO: ${JSON.stringify(payload)}`, ...prev]);
      } else {
        setLog(prev => [`[${timestamp}] ERRO: ${result.error || 'Falha no webhook'}`, ...prev]);
      }
    } catch (e) {
      setLog(prev => [`[${timestamp}] ERRO FATAL: Falha de rede`, ...prev]);
    }
    
    setIsSending(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-3">
            <Radio className="w-8 h-8 text-cyan-500" />
            Engenharia: Gateway IoT
          </h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-bold">
            Simulador de Sinais e Webhooks Universais
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CONTROL PANEL */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-indigo-400" /> Disparador de Sinais (Webhook POST)
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">1. Selecionar Space (Casa)</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                value={selectedSpace}
                onChange={(e) => setSelectedSpace(e.target.value)}
              >
                <option value="">-- Escolha um Space --</option>
                {spaces.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">2. Selecionar Equipamento Físico</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                disabled={!selectedSpace}
              >
                <option value="">-- Escolha um Dispositivo --</option>
                {devices.map(d => <option key={d.id} value={d.id}>{d.name} [{d.type}]</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">3. Ação do Hardware</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option value="turn_on">Ligar (ON)</option>
                <option value="turn_off">Desligar (OFF)</option>
                <option value="toggle">Alternar (Toggle)</option>
              </select>
            </div>

            <button 
              onClick={sendWebhook}
              disabled={!selectedDevice || isSending}
              className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl py-4 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {isSending ? 'A Enviar...' : 'Disparar Webhook para o Aura OS'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <h4 className="text-xs font-bold text-amber-500 uppercase mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Como usar isto no IFTTT real?
            </h4>
            <p className="text-sm text-slate-300">
              No IFTTT, crie um Applet onde o <b>IF</b> é o seu Sonoff/Shelly e o <b>THEN</b> é um "Webhooks (Make a web request)". Configure o URL para <code>https://oseudominio.com/api/iot</code>, Method <code>POST</code>, Content Type <code>application/json</code> e Body <code>{"{"}"deviceId": "COPIE_O_ID_AQUI", "action": "turn_on"{"}"}</code>.
            </p>
          </div>
        </div>

        {/* LOG PANEL */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 flex flex-col">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Cpu className="w-5 h-5 text-emerald-400" /> Logs do Gateway
          </h3>
          
          <div className="flex-1 bg-black/60 border border-slate-800 rounded-2xl p-4 font-mono text-xs overflow-y-auto max-h-[400px]">
            {log.length === 0 ? (
              <div className="text-slate-600 flex h-full items-center justify-center">Nenhum tráfego detetado.</div>
            ) : (
              log.map((entry, i) => (
                <div key={i} className={`mb-2 pb-2 border-b border-white/5 ${entry.includes('ERRO') ? 'text-red-400' : 'text-emerald-400'}`}>
                  {entry}
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
