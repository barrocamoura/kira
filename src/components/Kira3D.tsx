'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { Mic, Activity } from 'lucide-react';

const kiraSteps = [
  { text: "Kira, otimizar energia no piso 4.", response: "Otimização iniciada...\n> Ajustando HVAC\n> Desligando ecrãs ociosos\n> Energia poupada: 14%." },
  { text: "Kira, relatório de acessos na zona restrita.", response: "A gerar relatório...\n> 3 tentativas bloqueadas\n> Nenhuma quebra detetada\n> Segurança 100%." },
  { text: "Kira, modo noturno global.", response: "A ativar Modo Noturno...\n> Iluminação: 10%\n> Fechaduras: Trancadas\n> Alarmes: Armados." },
  { text: "Kira, análise de produtividade.", response: "A analisar dados de hoje...\n> Ocupação: 82%\n> Picos de utilização: 10:30 e 14:45\n> Sugestão: Aumentar ventilação às 10h." }
];

export default function AuraCore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  
  const [kiraStep, setKiraStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Command Progression Logic
  useEffect(() => {
    let interval: any;
    if (audioUnlocked && isInView) {
      interval = setInterval(() => {
        setKiraStep((prev) => (prev + 1) % kiraSteps.length);
      }, 7000);
    } else {
      setKiraStep(0);
    }
    return () => clearInterval(interval);
  }, [isInView, audioUnlocked]);

  // Voice Synth logic
  useEffect(() => {
    if (audioUnlocked && isInView && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      
      const currentText = kiraSteps[kiraStep].response;
      const textToSpeak = currentText.replace(/>/g, '').replace(/\n/g, '. ');
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'pt-PT';
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang.includes('pt') && (v.name.includes('Female') || v.name.includes('Luciana') || v.name.includes('Joana'))) || voices.find(v => v.lang.includes('pt'));
      if (ptVoice) utterance.voice = ptVoice;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  }, [kiraStep, isInView, audioUnlocked]);

  const handleUnlock = () => {
    // Unlock Audio
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const dummy = new SpeechSynthesisUtterance('Aura, online.');
      dummy.lang = 'pt-PT';
      dummy.volume = 1;
      window.speechSynthesis.speak(dummy);
    }
    setAudioUnlocked(true);
  };

  const currentStep = kiraSteps[kiraStep];
  const color = kiraStep >= 2 ? 'rgba(59, 130, 246' : 'rgba(16, 185, 129'; // Blue or Emerald

  return (
    <div ref={containerRef} className="relative w-full h-[600px] md:h-[700px] rounded-[3rem] bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col group">
      
      {/* Background ambient glow */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at center, ${color}, 0.1) 0%, transparent 60%)`,
          opacity: isSpeaking ? 0.8 : 0.3
        }}
      />

      {/* The Aura Core (CSS Orb) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Outer glow */}
          <div 
            className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ease-in-out ${isSpeaking ? 'scale-150 opacity-80' : 'scale-100 opacity-40'}`}
            style={{ backgroundColor: `${color}, 1)` }}
          />
          
          {/* Inner solid core */}
          <div 
            className={`absolute w-32 h-32 rounded-full backdrop-blur-3xl border border-white/60 transition-all duration-300 ${isSpeaking ? 'scale-110 shadow-[0_0_100px_rgba(16,185,129,0.6)]' : 'scale-100 shadow-[0_0_40px_rgba(16,185,129,0.2)]'}`}
            style={{ 
              background: `linear-gradient(135deg, ${color}, 0.9) 0%, transparent 100%)`,
            }}
          >
            {/* Inner rotating rings (optional pure CSS addition) */}
            <div className={`absolute inset-0 rounded-full border-t-4 border-white/60 ${isSpeaking ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }} />
            <div className={`absolute inset-2 rounded-full border-b-4 border-white/40 ${isSpeaking ? 'animate-spin' : ''}`} style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
          </div>
        </div>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl px-5 py-3 rounded-full border border-slate-200 shadow-sm">
            {audioUnlocked ? (
              <span className="relative flex h-3 w-3">
                {isSpeaking && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isSpeaking ? 'bg-emerald-500' : 'bg-emerald-500/50'}`}></span>
              </span>
            ) : (
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
            )}
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              {audioUnlocked ? 'AURA CORE ONLINE' : 'AURA OFFLINE'}
            </span>
          </div>

          {!audioUnlocked && (
            <button 
              onClick={handleUnlock}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/30"
            >
              <Mic className="w-5 h-5" />
              Ativar Som e Inteligência
            </button>
          )}
        </div>

        {/* Dynamic Command Island (Bottom) */}
        {audioUnlocked && (
          <div className="mx-auto w-full max-w-2xl bg-white/90 backdrop-blur-2xl p-6 rounded-3xl border border-slate-200 shadow-2xl mt-auto transition-all transform hover:scale-[1.01]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium text-slate-800">
                "{currentStep.text}"
              </h3>
              {isSpeaking && <Activity className="w-6 h-6 text-emerald-500 animate-pulse" />}
            </div>
            
            <div className="text-slate-600 font-mono text-sm bg-slate-50 w-full p-6 rounded-2xl border border-slate-200 shadow-inner min-h-[140px] flex flex-col justify-center">
              {currentStep.response.split('\n').map((line, i) => (
                <span key={`${kiraStep}-${i}`} className="block mb-2 font-medium" style={{ animation: `fadeIn 0.5s ease-out ${i * 0.2}s both` }}>
                  {line}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
