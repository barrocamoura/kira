'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

// Kira Commands Sequence
const kiraSteps = [
  { text: '"Kira, ativar Modo Cinema."', response: 'Iniciando Modo Cinema...' },
  { text: '"Kira, ativar Modo Cinema."', response: 'Iniciando Modo Cinema...\n> Fechando persianas' },
  { text: '"Kira, ativar Modo Cinema."', response: 'Iniciando Modo Cinema...\n> Fechando persianas\n> Ajustando luz para 10%' },
  { text: '"Kira, ativar Modo Cinema."', response: 'Iniciando Modo Cinema...\n> Fechando persianas\n> Ajustando luz para 10%\n> Ligando ecrã. Bom filme.' }
];

export default function Kira3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });
  
  const [kiraStep, setKiraStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Global click to unlock audio context smoothly
  useEffect(() => {
    const handleGlobalClick = () => {
      setAudioUnlocked(true);
      window.removeEventListener('click', handleGlobalClick);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  useEffect(() => {
    let interval: any;
    
    if (isInView) {
      interval = setInterval(() => {
        setKiraStep((prev) => (prev + 1) % kiraSteps.length);
      }, 4500);
    } else {
      setKiraStep(0);
    }

    return () => clearInterval(interval);
  }, [isInView]);

  // Voice Synth logic
  useEffect(() => {
    if (audioUnlocked && isInView && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      setIsSpeaking(true);
      
      const lines = kiraSteps[kiraStep].response.split('\n');
      const lastLine = lines[lines.length - 1];
      const textToSpeak = lastLine.replace(/>/g, '').replace(/\n/g, '. ');
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'pt-PT';
      utterance.rate = 0.95;
      utterance.pitch = 1.2;
      
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang.includes('pt') && (v.name.includes('Female') || v.name.includes('Luciana') || v.name.includes('Joana') || v.name.includes('Francisca'))) || voices.find(v => v.lang.includes('pt'));
      if (ptVoice) utterance.voice = ptVoice;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  }, [kiraStep, isInView, audioUnlocked]);

  return (
    <div ref={containerRef} className="relative w-full aspect-square md:aspect-video rounded-[3rem] bg-[#050505] border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col items-center justify-center group">
      
      {!audioUnlocked && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-500" onClick={() => setAudioUnlocked(true)}>
          <button className="px-8 py-4 bg-emerald-500 text-black font-black text-lg rounded-full animate-pulse shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:scale-105 transition-transform">
            Iniciar Experiência Interativa
          </button>
          <p className="text-slate-400 mt-4 text-sm max-w-sm text-center">O seu browser necessita de uma interação inicial para desbloquear a voz da IA.</p>
        </div>
      )}

      {/* 3D Hologram Avatar Layer */}
      <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden">
        {/* Background Environment Simulator */}
        <div className={`absolute inset-0 transition-opacity duration-2000 ${kiraStep >= 2 ? 'opacity-30' : 'opacity-10'}`}>
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-[#050505] to-[#050505]" />
        </div>
        {/* TV Glow */}
        <div className={`absolute w-full h-full bg-blue-500/20 blur-[100px] transition-opacity duration-2000 ${kiraStep >= 3 ? 'opacity-100' : 'opacity-0'}`} />

        <Tilt
          tiltMaxAngleX={20}
          tiltMaxAngleY={20}
          perspective={1000}
          transitionSpeed={1000}
          scale={1.1}
          gyroscope={true}
          className="z-10"
        >
          {/* Avatar Container with 3D Depth */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-emerald-500/50 shadow-[0_0_50px_rgba(52,211,153,0.5)] flex items-center justify-center transform-gpu">
            {/* Hologram rings */}
            <div className={`absolute inset-[-20%] rounded-full border-2 border-emerald-400/30 animate-[spin_10s_linear_infinite] ${isSpeaking ? 'border-emerald-400/80 scale-110 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : ''} transition-all duration-500`} style={{ transform: 'translateZ(-50px)' }} />
            <div className={`absolute inset-[-40%] rounded-full border border-blue-400/20 animate-[spin_15s_linear_infinite_reverse] ${kiraStep >= 3 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`} style={{ transform: 'translateZ(-100px)' }} />
            
            {/* Core Image */}
            <div className="w-full h-full rounded-full overflow-hidden relative bg-black" style={{ transform: 'translateZ(50px)' }}>
              <div className={`absolute inset-0 mix-blend-overlay z-10 transition-colors duration-1000 ${kiraStep >= 3 ? 'bg-blue-500/40' : 'bg-emerald-500/30'} ${isSpeaking ? 'animate-pulse' : ''}`} />
              <img 
                src="/images/kira-avatar.png" 
                alt="Kira Avatar" 
                className="w-full h-full object-cover opacity-90 scale-110 hover:scale-125 transition-transform duration-1000" 
              />
            </div>
          </div>
        </Tilt>
      </div>

      {/* UI Overlay */}
      <div className="relative z-20 w-full h-full p-8 flex flex-col justify-between pointer-events-none">
        
        {/* Status Indicator */}
        <div className="self-start flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <span className="relative flex h-2 w-2">
            {isSpeaking && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isSpeaking ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
          </span>
          <span className="text-xs font-bold text-white uppercase tracking-widest">
            {isSpeaking ? 'Kira AI (A Falar)' : 'Kira AI (Standby)'}
          </span>
        </div>

        {/* Interactive Terminal Overlay */}
        <div className="w-full max-w-xl mx-auto bg-black/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl mt-auto translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-xl md:text-3xl font-black text-white mb-4 drop-shadow-lg leading-tight">
            {kiraSteps[kiraStep].text}
          </h3>
          <div className="text-emerald-400 font-mono text-sm md:text-base bg-black/50 w-full p-4 md:p-6 rounded-2xl border border-emerald-500/20 text-left shadow-inner min-h-[140px] flex flex-col justify-end">
            {kiraSteps[kiraStep].response.split('\n').map((line, i) => (
              <span key={`${kiraStep}-${i}`} className="block animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>{line}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
