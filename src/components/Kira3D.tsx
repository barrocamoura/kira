'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, OrbitControls, Environment, Float, Box } from '@react-three/drei';
import { useInView } from 'framer-motion';

// Kira Commands Sequence
const kiraSteps = [
  { text: '"Kira, ativar Modo Cinema."', response: 'Iniciando Modo Cinema...' },
  { text: '"Kira, ativar Modo Cinema."', response: 'Iniciando Modo Cinema...\n> Fechando persianas' },
  { text: '"Kira, ativar Modo Cinema."', response: 'Iniciando Modo Cinema...\n> Fechando persianas\n> Ajustando luz para 10%' },
  { text: '"Kira, ativar Modo Cinema."', response: 'Iniciando Modo Cinema...\n> Fechando persianas\n> Ajustando luz para 10%\n> Ligando ecrã. Bom filme.' }
];

// The glowing AI Core
const AICore = ({ isActive, step }: { isActive: boolean, step: number }) => {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      
      // Pulse scale when active
      const targetScale = isActive ? 1.2 + Math.sin(state.clock.elapsedTime * 10) * 0.1 : 1;
      meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.1);
    }
  });

  // Color logic based on step
  const coreColor = step >= 3 ? '#3b82f6' : '#10b981'; // Shifts to blue at the end

  return (
    <Float speed={isActive ? 4 : 2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={1}>
        <MeshDistortMaterial
          color={coreColor}
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={isActive ? 0.6 : 0.3} // Higher distortion when speaking
          speed={isActive ? 5 : 2}
          emissive={coreColor}
          emissiveIntensity={isActive ? 0.8 : 0.2}
        />
      </Sphere>
      
      {/* Halo glow */}
      <Sphere args={[1.2, 32, 32]}>
        <meshBasicMaterial color={coreColor} transparent opacity={isActive ? 0.15 : 0.05} />
      </Sphere>
    </Float>
  );
};

// 3D Environment (Abstract Room Grid)
const SmartRoom = ({ step }: { step: number }) => {
  const roomRef = useRef<any>(null);

  useFrame((state) => {
    if (roomRef.current) {
      roomRef.current.rotation.y = state.clock.getElapsedTime() * 0.05; // Slow ambient rotation
    }
  });

  const ambientLightIntensity = step >= 2 ? 0.1 : 1; // Dims on step 2
  const tvGlowIntensity = step >= 3 ? 5 : 0; // TV turns on at step 3

  return (
    <group ref={roomRef} position={[0, -2, -2]}>
      <ambientLight intensity={ambientLightIntensity} />
      
      {/* Floor */}
      <Box args={[10, 0.2, 10]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} wireframe={step < 3} />
      </Box>
      
      {/* Abstract Furniture / Server racks */}
      <Box args={[1, 2, 1]} position={[-3, 0, -2]}>
        <meshStandardMaterial color="#222" wireframe />
      </Box>
      <Box args={[2, 1, 1]} position={[2, -0.5, 2]}>
        <meshStandardMaterial color="#222" wireframe />
      </Box>

      {/* TV Glow Source */}
      <pointLight position={[0, 2, -4]} color="#3b82f6" intensity={tvGlowIntensity} distance={10} />
      {/* Center Spotlight on AI Core */}
      <spotLight position={[0, 5, 0]} color="#10b981" intensity={step >= 2 ? 0.5 : 2} angle={0.5} penumbra={1} />
    </group>
  );
};

export default function Kira3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });
  
  const [kiraStep, setKiraStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    let interval: any;
    
    // Auto-play when scrolled into view
    if (isInView) {
      interval = setInterval(() => {
        setKiraStep((prev) => {
          const next = (prev + 1) % kiraSteps.length;
          return next;
        });
      }, 4500);
    } else {
      setKiraStep(0); // Reset if out of view
    }

    return () => clearInterval(interval);
  }, [isInView]);

  // Voice Synth logic
  useEffect(() => {
    if (isInView && typeof window !== 'undefined' && 'speechSynthesis' in window) {
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
  }, [kiraStep, isInView]);

  return (
    <div ref={containerRef} className="relative w-full aspect-square md:aspect-video rounded-[3rem] bg-[#050505] border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col group">
      
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0 cursor-move">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Environment preset="city" />
          <SmartRoom step={kiraStep} />
          <AICore isActive={isSpeaking} step={kiraStep} />
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 4} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 p-8 flex flex-col justify-end h-full pointer-events-none">
        
        {/* Status Indicator */}
        <div className="absolute top-8 left-8 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <span className="relative flex h-2 w-2">
            {isSpeaking && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isSpeaking ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
          </span>
          <span className="text-xs font-bold text-white uppercase tracking-widest">
            {isSpeaking ? 'Kira AI (A Processar)' : 'Kira AI (Standby)'}
          </span>
        </div>

        {/* Interactive Terminal Overlay */}
        <div className="w-full max-w-lg mx-auto bg-black/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
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
