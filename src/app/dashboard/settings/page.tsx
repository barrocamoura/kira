"use client";

import React, { useEffect, useState } from 'react';
import { Settings, CheckSquare, Square, MonitorSmartphone, Save } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function SettingsPage() {
  const [kioskSettings, setKioskSettings] = useState<any>({
    news: true,
    weather: true,
    energy: true,
    solar: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase
        .from('kiosk_settings')
        .select('widgets')
        .eq('user_id', user.id)
        .single();
        
      if (data && data.widgets) {
        setKioskSettings(data.widgets);
      }
      setLoading(false);
    };
    
    fetchSettings();
  }, []);

  const toggleWidget = (key: string) => {
    setKioskSettings((prev: any) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('kiosk_settings')
        .upsert({ user_id: user.id, widgets: kioskSettings, updated_at: new Date().toISOString() });
        
      if (!error) {
        alert("Configurações do Kiosk guardadas com sucesso!");
      }
    }
    setSaving(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-500" /> Configurações
        </h1>
        <p className="text-white/50 mt-2">Gerir perfil, subscrição e preferências do sistema.</p>
      </div>
      
      <div className="bg-black border border-slate-800 rounded-3xl p-6 shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <MonitorSmartphone className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Kiosk Builder</h2>
            <p className="text-sm text-slate-500">Escolha os módulos a apresentar no seu Tablet de Parede.</p>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-500 py-4">A carregar configurações...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {[
              { id: 'weather', name: 'Clima e Meteorologia', desc: 'Previsão do tempo e temperatura atual' },
              { id: 'energy', name: 'Consumo Energético', desc: 'Gráficos de energia e potência da casa' },
              { id: 'solar', name: 'Geração Solar', desc: 'Produção fotovoltaica e fluxo de bateria' },
              { id: 'news', name: 'Notícias Locais', desc: 'Feed RSS com os principais destaques' },
            ].map(widget => (
              <div 
                key={widget.id}
                onClick={() => toggleWidget(widget.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-4
                  ${kioskSettings[widget.id] ? 'bg-amber-500/5 border-amber-500/30' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <div className="mt-1 text-amber-500">
                  {kioskSettings[widget.id] ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 opacity-50" />}
                </div>
                <div>
                  <div className={`font-bold ${kioskSettings[widget.id] ? 'text-amber-500' : 'text-white'}`}>{widget.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{widget.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end relative z-10">
          <button 
            onClick={saveSettings}
            disabled={saving || loading}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'A Guardar...' : 'Guardar Kiosk'}
          </button>
        </div>
      </div>
    </div>
  );
}
