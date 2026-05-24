"use client";

import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-500" /> Configurações
        </h1>
        <p className="text-white/50 mt-2">Gerir perfil, subscrição e preferências.</p>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/50">
        <p>Painel de configurações em desenvolvimento.</p>
      </div>
    </div>
  );
}
