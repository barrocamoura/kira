'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, ContactShadows, PresentationControls, Html } from '@react-three/drei';
import { useInView } from 'framer-motion';

// Generic 3D Robot Model from pmndrs market
const ROBOT_GLTF_URL = 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/robot/model.gltf';

// Pre-load the 3D model
useGLTF.preload(ROBOT_GLTF_URL);

// The 3D Robot Component
function RobotAvatar({ isSpeaking, step }: { isSpeaking: boolean, step: number }) {
  const { scene } = useGLTF(ROBOT_GLTF_URL);
  const robotRef = useRef<any>(null);

  useFrame((state) => {
    if (robotRef.current) {
      // Gentle floating and breathing animation based on speaking state
      const t = state.clock.getElapsedTime();
      robotRef.current.position.y = Math.sin(t * (isSpeaking ? 4 : 2)) * 0.1;
      
      // Look at the mouse cursor
      robotRef.current.rotation.y = THREE.MathUtils.lerp(
        robotRef.current.rotation.y,
        (state.mouse.x * Math.PI) / 4,
        0.1
      );
      robotRef.current.rotation.x = THREE.MathUtils.lerp(
        robotRef.current.rotation.x,
        (-state.mouse.y * Math.PI) / 4,
        0.1
      );
    }
  });

  // Change robot color dynamically based on step
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material && child.material.name === 'Main') {
        const color = step >= 3 ? '#3b82f6' : '#10b981';
        child.material.color.set(color);
        if (isSpeaking) {
          child.material.emissive.set(color);
          child.material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.01) * 0.5;
        } else {
          child.material.emissiveIntensity = 0;
        }
      }
    });
  }, [isSpeaking, step, scene]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <primitive ref={robotRef} object={scene} scale={1.5} position={[0, -1, 0]} />
    </Float>
  );
}

// 3D Loader
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-emerald-500 font-mono text-sm tracking-widest">A Carregar Kira 3D...</span>
      </div>
    </Html>
  );
}

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

  // GLOBAL AUDIO BYPASS: Unlock audio context on the first click ANYWHERE on the page!
  // This removes the need for an ugly button overlay on the Kira section.
  useEffect(() => {
    const handleGlobalClick = () => {
      if (!audioUnlocked) {
        // Create an empty audio context to unlock browser policy
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          ctx.resume().then(() => {
            setAudioUnlocked(true);
            window.removeEventListener('click', handleGlobalClick);
            window.removeEventListener('touchstart', handleGlobalClick);
          });
        }
      }
    };
    
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('touchstart', handleGlobalClick);
    
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [audioUnlocked]);

  // Command Progression Logic
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

  // Voice Synth logic (Autoplays ONLY if audio is unlocked)
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
    <div ref={containerRef} className="relative w-full aspect-square md:aspect-video rounded-[3rem] bg-[#050505] border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col group">
      
      {/* 3D WebGL Canvas Layer - The True Avatar */}
      <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Environment preset="city" />
          
          <PresentationControls 
            global 
            config={{ mass: 2, tension: 500 }} 
            snap={{ mass: 4, tension: 1500 }} 
            rotation={[0, 0.3, 0]} 
            polar={[-Math.PI / 3, Math.PI / 3]} 
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <Suspense fallback={<Loader />}>
              <RobotAvatar isSpeaking={isSpeaking} step={kiraStep} />
            </Suspense>
          </PresentationControls>
          
          <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 p-8 flex flex-col justify-between h-full pointer-events-none">
        
        {/* Status Indicator */}
        <div className="self-start flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <span className="relative flex h-2 w-2">
            {isSpeaking && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isSpeaking ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
          </span>
          <span className="text-xs font-bold text-white uppercase tracking-widest">
            {isSpeaking ? 'Kira 3D (A Processar)' : 'Kira 3D (Standby)'}
          </span>
        </div>

        {/* Warning if audio not unlocked yet */}
        {!audioUnlocked && (
          <div className="absolute top-8 right-8 bg-red-500/10 border border-red-500/50 text-red-400 text-xs px-3 py-1 rounded-full animate-pulse">
            Voz bloqueada pelo browser. Clique algures para ativar.
          </div>
        )}

        {/* Interactive Terminal Overlay */}
        <div className="w-full max-w-lg mx-auto bg-black/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl mt-auto">
          <h3 className="text-xl md:text-2xl font-black text-white mb-4 drop-shadow-lg">
            {kiraSteps[kiraStep].text}
          </h3>
          <div className="text-emerald-400 font-mono text-sm bg-black w-full p-4 rounded-xl border border-emerald-500/20 text-left shadow-inner min-h-[120px]">
            {kiraSteps[kiraStep].response.split('\n').map((line, i) => (
              <span key={`${kiraStep}-${i}`} className="block animate-fade-in-up" style={{ animationDelay: '100ms' }}>{line}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
