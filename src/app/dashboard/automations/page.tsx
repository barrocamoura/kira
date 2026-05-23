"use client";

import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, Zap, SunMoon, Play, Activity, Mic, MicOff, Volume2, Globe } from 'lucide-react';

type SceneCommand = {
  device: string;
  action: string;
  value: string | number;
};

type GeneratedScene = {
  name: string;
  icon: React.ReactNode;
  commands: SceneCommand[];
  voiceResponse: string;
};

// Dicionário LLM Simulado baseado no Local/Idioma
const i18nBrain: Record<string, any> = {
  'pt': {
    moviePrompt: ["filme", "cinema", "netflix"],
    movieScene: "Modo Cinema Ativado",
    movieResponse: "Entendido. Preparando a sala para o seu filme. Diminuindo as luzes para 10% e ligando o ar-condicionado em 22 graus. Bom entretenimento.",
    movieCmds: [
      { device: "Luz Principal da Sala", action: "Definir Intensidade", value: "10%" },
      { device: "Fita de LED da TV", action: "Definir Cor", value: "#4B0082 (Índigo)" },
      { device: "Ar-Condicionado", action: "Ligar", value: "22°C" }
    ],
    defaultScene: "Cena Espacial Adaptativa",
    defaultResponse: "Comandos recebidos. Ajustando o ambiente conforme sua requisição imediatamente.",
    defaultCmds: [
      { device: "Iluminação Geral", action: "Ajustar Inteligência", value: "Modo Adaptativo" }
    ],
    placeholder: "Ex: Quero assistir um filme na sala...",
    listening: "Kira está te ouvindo...",
    idle: "Fale ou digite seu comando:"
  },
  'en': {
    moviePrompt: ["movie", "cinema", "netflix", "watch"],
    movieScene: "Cinema Mode Activated",
    movieResponse: "Understood. Preparing the room for your movie. Dimming the lights to 10% and turning on the AC at 72 Fahrenheit. Enjoy.",
    movieCmds: [
      { device: "Main Room Light", action: "Set Intensity", value: "10%" },
      { device: "TV LED Strip", action: "Set Color", value: "#4B0082 (Indigo)" },
      { device: "Air Conditioner", action: "Turn On", value: "72°F" }
    ],
    defaultScene: "Adaptive Spatial Scene",
    defaultResponse: "Commands received. Adjusting the environment according to your request immediately.",
    defaultCmds: [
      { device: "General Lighting", action: "Smart Adjust", value: "Adaptive Mode" }
    ],
    placeholder: "Ex: I want to watch a movie in the living room...",
    listening: "Kira is listening to you...",
    idle: "Speak or type your command:"
  }
};

export default function AutomationsPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [generatedScene, setGeneratedScene] = useState<GeneratedScene | null>(null);
  
  // Detecção Automática de Geolocalização/Idioma
  const [userLocale, setUserLocale] = useState('pt-BR');
  const [baseLang, setBaseLang] = useState('pt');

  useEffect(() => {
    // Detecta o idioma do navegador do cliente logo no carregamento
    if (typeof navigator !== 'undefined') {
      const detectedLocale = navigator.language || 'pt-BR';
      setUserLocale(detectedLocale);
      setBaseLang(detectedLocale.startsWith('en') ? 'en' : 'pt');
    }
  }, []);

  const t = i18nBrain[baseLang];

  const SpeechRecognition = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;

  const speakResponse = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Dinamicamente aplica a linguagem baseada na geolocalização do usuário
      utterance.lang = userLocale; 
      utterance.rate = 1.05; 
      utterance.pitch = 1.0; 
      
      // Procura a melhor voz nativa para aquele idioma local
      const voices = window.speechSynthesis.getVoices();
      const localVoice = voices.find(v => v.lang.includes(baseLang) && (v.name.includes('Google') || v.name.includes('Siri')));
      if (localVoice) utterance.voice = localVoice;

      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta a API nativa de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    // A IA Escuta no idioma geolocalizado do usuário
    recognition.lang = userLocale;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
      setPrompt(""); 
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      processPrompt(transcript);
    };

    recognition.onerror = (e: any) => {
      console.error(e);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const processPrompt = (textToProcess: string) => {
    if (!textToProcess) return;

    setIsGenerating(true);
    setGeneratedScene(null);

    setTimeout(() => {
      const lowerText = textToProcess.toLowerCase();
      const isMovie = t.moviePrompt.some((word: string) => lowerText.includes(word));
      
      const newScene: GeneratedScene = isMovie ? {
        name: t.movieScene,
        icon: <Play className="w-6 h-6 text-purple-400" />,
        voiceResponse: t.movieResponse,
        commands: t.movieCmds
      } : {
        name: t.defaultScene,
        icon: <SunMoon className="w-6 h-6 text-yellow-400" />,
        voiceResponse: t.defaultResponse,
        commands: t.defaultCmds
      };

      setGeneratedScene(newScene);
      setIsGenerating(false);
      speakResponse(newScene.voiceResponse); 

    }, 1500);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    processPrompt(prompt);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-12">
      {/* Cabeçalho */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Workflow className="w-8 h-8 text-blue-400" />
            Assistente de Voz & IA (Kira)
          </h2>
          <p className="text-white/60">Converse naturalmente. A IA escuta, fala e comanda os hardwares.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <Globe className="w-3 h-3" /> Detectado: {userLocale.toUpperCase()}
          </div>
          <span className="text-[10px] text-white/30">O idioma da Kira foi auto-ajustado.</span>
        </div>
      </div>

      {/* Caixa de Criação por Voz / IA */}
      <div className={`bg-gradient-to-b border rounded-3xl p-8 backdrop-blur-md relative overflow-hidden transition-all duration-700 ${isListening ? 'from-blue-900/40 to-purple-900/20 border-blue-400/60 shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 'from-blue-900/10 to-purple-900/5 border-blue-500/20'}`}>
        
        {isListening && <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none" />}
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Bot className={`w-6 h-6 ${isListening ? 'text-blue-300 animate-bounce' : 'text-blue-400'}`} />
            {isListening ? t.listening : t.idle}
          </h3>
          
          <button 
            type="button"
            onClick={isListening ? () => {} : startListening}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition shadow-lg ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            {isListening ? '...' : (baseLang === 'en' ? 'Turn On Mic' : 'Ativar Microfone')}
          </button>
        </div>
        
        <form onSubmit={handleGenerate} className="relative z-10">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.placeholder}
            className="w-full bg-black/60 border border-white/20 rounded-2xl pl-6 pr-16 py-5 text-lg text-white focus:outline-none focus:border-blue-500 transition shadow-inner placeholder-white/30"
            disabled={isGenerating || isListening}
          />
          <button 
            type="submit" 
            disabled={isGenerating || !prompt || isListening}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 disabled:bg-transparent disabled:text-white/30 text-white p-3 rounded-xl transition"
          >
            {isGenerating ? <Activity className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>

      {/* Área de Resultado da IA */}
      {generatedScene && (
        <div className="bg-white/5 border border-emerald-500/30 rounded-3xl p-8 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-white/10 pb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                {generatedScene.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{generatedScene.name}</h3>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => speakResponse(generatedScene.voiceResponse)}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition flex items-center justify-center"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-8 p-4 bg-blue-900/20 border-l-4 border-blue-500 rounded-r-xl italic text-blue-200">
            &quot; {generatedScene.voiceResponse} &quot;
          </div>

          <div className="space-y-3">
            {generatedScene.commands.map((cmd, idx) => (
              <div key={idx} className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/50">{idx + 1}</div>
                  <div className="font-semibold">{cmd.device}</div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-white/50">{cmd.action}:</span>
                  <span className="px-3 py-1 bg-white/10 border border-white/5 rounded-lg font-mono text-emerald-300">{cmd.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Workflow(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="8" x="3" y="3" rx="2" /><path d="M7 11v4a2 2 0 0 0 2 2h4" /><rect width="8" height="8" x="13" y="13" rx="2" /></svg>
  )
}
