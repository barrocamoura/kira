"use client";

import React from 'react';
import { Building } from 'lucide-react';

export default function EnterprisePage() {
  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Building className="w-8 h-8 text-blue-500" /> Gestão Enterprise
        </h1>
        <p className="text-white/50 mt-2">Controlo multi-tenant de edifícios B2B.</p>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/50">
        <p>Módulo B2B restrito a subscrições Enterprise.</p>
      </div>
    </div>
  );
}
