"use client";

import React, { useEffect, useState } from 'react';
import { Mic, Sun, Moon, CloudRain, Lightbulb, Power, Maximize } from 'lucide-react';

export default function KioskPage() {
  const [time, setTime] = useState(new Date());
  const [isNight, setIsNight] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      // Lógica Simples Dia/Noite (Noite = das 19h às 06h)
      const hour = now.getHours();
      setIsNight(hour >= 19 || hour < 6);
    }, 1000);
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
      // Aqui faríamos a chamada à API da Aura (LLM) para traduzir o texto num comando JSON
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

      {/* Main Widgets */}
      <div className="flex-1 grid grid-cols-3 gap-6 mt-16 z-10">
        {/* Clima */}
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

        {/* Quick Controls */}
        <div className={`col-span-2 rounded-3xl border p-8 ${cardClass}`}>
          <div className={`text-sm font-bold uppercase tracking-widest mb-6 ${subText}`}>Acessos Rápidos</div>
          <div className="grid grid-cols-4 gap-4">
            <button className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all hover:bg-blue-500 hover:text-white hover:border-blue-500 ${isNight ? 'bg-white/5 border-white/10' : 'bg-white border-white'}`}>
              <Lightbulb className="w-8 h-8" />
              <span className="font-bold text-sm">Luzes Sala</span>
            </button>
            <button className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all hover:bg-red-500 hover:text-white hover:border-red-500 ${isNight ? 'bg-white/5 border-white/10' : 'bg-white border-white'}`}>
              <Power className="w-8 h-8" />
              <span className="font-bold text-sm">Desligar Tudo</span>
            </button>
          </div>
        </div>
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
