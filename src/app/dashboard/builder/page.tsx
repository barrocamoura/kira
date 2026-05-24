"use client";

import React from 'react';
import { Box } from 'lucide-react';

export default function BuilderPage() {
  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Box className="w-8 h-8 text-blue-500" /> Construtor 3D
        </h1>
        <p className="text-white/50 mt-2">Mapeamento espacial da sua casa.</p>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/50">
        <p>Motor WebGL 3D em desenvolvimento.</p>
      </div>
    </div>
  );
}
