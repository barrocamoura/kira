"use client";

import React from 'react';
import { Home } from 'lucide-react';

export default function EnvironmentsPage() {
  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Home className="w-8 h-8 text-blue-500" /> Meus Ambientes
        </h1>
        <p className="text-white/50 mt-2">Gestão de divisões e dispositivos IoT associados.</p>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/50">
        <p>Módulo de Ambientes em desenvolvimento.</p>
      </div>
    </div>
  );
}
