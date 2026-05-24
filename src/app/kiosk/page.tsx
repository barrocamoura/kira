"use client";

import React, { useEffect, useState } from 'react';
import { Mic, Sun, Moon, CloudRain, Lightbulb, Power, Maximize, Zap, Battery, Newspaper, Calendar, Car, Camera, CheckSquare } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function KioskPage() {
  const [time, setTime] = useState(new Date());
  const [isNight, setIsNight] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Custom Widgets State
  const [kioskSettings, setKioskSettings] = useState<any>({
    news: false,
    weather: true,
    energy: false,
    solar: false,
    calendar: false,
    traffic: false,
    cctv: false,
    todo: false
  });

  useEffect(() => {
    // 1. Clock and Theme Logic
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      const hour = now.getHours();
      setIsNight(hour >= 19 || hour < 6);
    }, 1000);
    
    // 2. Load Settings from DB
    const fetchSettings = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('kiosk_settings')
          .select('widgets')
          .eq('user_id', user.id)
          .single();
          
        if (data && data.widgets) {
          setKioskSettings(data.widgets);
        }
      }
    };
    fetchSettings();

    return () => clearInterval(timer);
  }, []);

  const handleVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("O seu browser não suporta reconhecimento de voz.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-PT';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('A escutar comando...');
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(`Comando registado: "${text}"`);
      setTimeout(() => setTranscript(''), 4000);
    };

    recognition.onerror = () => {
      setTranscript('Erro ao ouvir. Tente novamente.');
      setTimeout(() => setTranscript(''), 3000);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  // Cores dinâmicas Dia/Noite
  const bgClass = isNight ? 'bg-black text-white' : 'bg-[#e6e9ee] text-slate-800';
  const cardClass = isNight ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white/60 shadow-xl backdrop-blur-xl';
  const accentText = isNight ? 'text-white' : 'text-slate-900';
  const subText = isNight ? 'text-white/50' : 'text-slate-500';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-1000 flex flex-col p-8 overflow-hidden relative`}>
      
      {/* Efeito Glow Ambiente */}
      {isNight ? (
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      ) : (
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 blur-[150px] rounded-full pointer-events-none" />
      )}

      {/* Top Header */}
      <header className="flex justify-between items-start z-10">
        <div>
          <h1 className={`text-8xl font-black tracking-tighter ${accentText}`}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h1>
          <p className={`text-2xl font-medium mt-2 uppercase tracking-widest ${subText}`}>
            {time.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={toggleFullscreen} className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${cardClass} hover:scale-105`}>
            <Maximize className="w-6 h-6" />
          </button>
          <div className={`px-6 h-14 rounded-2xl flex items-center gap-3 border ${cardClass}`}>
            {isNight ? <Moon className="w-6 h-6 text-blue-400" /> : <Sun className="w-6 h-6 text-amber-500" />}
            <span className="font-bold text-lg">Casa de Campo</span>
          </div>
        </div>
      </header>

      {/* Main Widgets Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-16 z-10">
        
        {/* WIDGET: Clima (Weather) */}
        {kioskSettings.weather && (
          <div className={`rounded-3xl border p-8 flex flex-col justify-between ${cardClass}`}>
            <div>
              <div className={`text-sm font-bold uppercase tracking-widest mb-1 ${subText}`}>Clima Exterior</div>
              <div className="text-5xl font-black">18°C</div>
            </div>
            <div className="flex items-center gap-3">
              <CloudRain className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-medium">Chuva Leve</span>
            </div>
          </div>
        )}

        {/* WIDGET: Consumo Energético */}
        {kioskSettings.energy && (
          <div className={`rounded-3xl border p-8 flex flex-col justify-between ${cardClass}`}>
            <div>
              <div className={`text-sm font-bold uppercase tracking-widest mb-1 ${subText}`}>Consumo Total</div>
              <div className="text-4xl font-black">2.4 kW</div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-amber-500" />
              <span className="text-lg font-medium">Dentro da média</span>
            </div>
          </div>
        )}

        {/* WIDGET: Geração Solar */}
        {kioskSettings.solar && (
          <div className={`rounded-3xl border p-8 flex flex-col justify-between ${cardClass}`}>
            <div>
              <div className={`text-sm font-bold uppercase tracking-widest mb-1 ${subText}`}>Painéis Solares</div>
              <div className="text-4xl font-black text-emerald-500">4.1 kW</div>
            </div>
            <div className="flex items-center gap-3">
              <Battery className="w-8 h-8 text-emerald-400" />
              <span className="text-lg font-medium">Bateria a 100%</span>
            </div>
          </div>
        )}

        {/* Quick Controls (Sempre visível) */}
        <div className={`col-span-1 md:col-span-2 xl:col-span-2 rounded-3xl border p-8 ${cardClass}`}>
          <div className={`text-sm font-bold uppercase tracking-widest mb-6 ${subText}`}>Acessos Rápidos</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all hover:bg-blue-500 hover:text-white hover:border-blue-500 ${isNight ? 'bg-white/5 border-white/10' : 'bg-white border-white'}`}>
              <Lightbulb className="w-8 h-8" />
              <span className="font-bold text-sm">Luzes Sala</span>
            </button>
            <button className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all hover:bg-red-500 hover:text-white hover:border-red-500 ${isNight ? 'bg-white/5 border-white/10' : 'bg-white border-white'}`}>
              <Power className="w-8 h-8" />
              <span className="font-bold text-sm text-center leading-tight">Desligar Tudo</span>
            </button>
          </div>
        </div>

        {/* WIDGET: Agenda Familiar */}
        {kioskSettings.calendar && (
          <div className={`rounded-3xl border p-8 flex flex-col justify-between ${cardClass}`}>
            <div>
              <div className={`text-sm font-bold uppercase tracking-widest mb-3 ${subText}`}>Agenda de Hoje</div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-bold">14:00 - Reunião com Arquitetos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-bold">18:30 - Jantar de Aniversário</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm font-bold">
              <Calendar className="w-4 h-4" /> 2 Eventos pendentes
            </div>
          </div>
        )}

        {/* WIDGET: Trânsito */}
        {kioskSettings.traffic && (
          <div className={`rounded-3xl border p-8 flex flex-col justify-between ${cardClass}`}>
            <div>
              <div className={`text-sm font-bold uppercase tracking-widest mb-1 ${subText}`}>Trânsito p/ Escritório</div>
              <div className="text-4xl font-black text-amber-500">28 min</div>
            </div>
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8 text-amber-500" />
              <span className="text-sm font-bold">Trânsito intenso na A5. +10 min de atraso.</span>
            </div>
          </div>
        )}

        {/* WIDGET: Lista de Compras/Tarefas */}
        {kioskSettings.todo && (
          <div className={`rounded-3xl border p-8 flex flex-col justify-between ${cardClass}`}>
            <div>
              <div className={`text-sm font-bold uppercase tracking-widest mb-3 ${subText}`}>Lista de Compras</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-slate-400 line-through">
                  <CheckSquare className="w-5 h-5 text-emerald-500" /> Leite e Ovos
                </div>
                <div className="flex items-center gap-3 font-bold">
                  <div className="w-5 h-5 rounded border border-slate-500" /> Cápsulas Nespresso
                </div>
                <div className="flex items-center gap-3 font-bold">
                  <div className="w-5 h-5 rounded border border-slate-500" /> Fruta
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WIDGET: CCTV Câmaras */}
        {kioskSettings.cctv && (
          <div className={`col-span-1 md:col-span-2 xl:col-span-2 rounded-3xl border p-6 flex flex-col gap-3 ${cardClass}`}>
            <div className={`text-sm font-bold uppercase tracking-widest ${subText} flex items-center gap-2`}>
              <Camera className="w-4 h-4" /> Câmaras de Segurança
            </div>
            <div className="flex-1 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded uppercase animate-pulse">Ao Vivo</div>
              <span className="text-slate-600 font-bold">Entrada Principal (Sem Sinal)</span>
            </div>
          </div>
        )}

        {/* WIDGET: Notícias Locais */}
        {kioskSettings.news && (
          <div className={`col-span-1 md:col-span-3 xl:col-span-4 rounded-3xl border p-6 flex items-center gap-6 ${cardClass}`}>
            <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center shrink-0">
              <Newspaper className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${subText}`}>Últimas Notícias</div>
              <div className="text-xl font-bold">Governo aprova novos incentivos para transição energética e painéis solares em 2027.</div>
            </div>
          </div>
        )}

      </div>

      {/* Voice Control Footer */}
      <div className="mt-8 flex flex-col items-center justify-center z-10">
        <button 
          onClick={handleVoiceCommand}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.1)] ${isListening ? 'bg-red-500 scale-110 shadow-red-500/50 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'}`}
        >
          <Mic className="w-10 h-10 text-white" />
        </button>
        <div className={`mt-6 h-8 text-lg font-medium transition-opacity ${transcript ? 'opacity-100' : 'opacity-0'}`}>
          {transcript}
        </div>
      </div>

    </div>
  );
}
