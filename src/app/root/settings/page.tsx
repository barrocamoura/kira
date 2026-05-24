import React from 'react';
import { Settings, ShieldAlert, Key } from 'lucide-react';

export default function RootSettings() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white">Platform Settings</h2>
        <p className="text-slate-400 mt-2">Configurações globais do sistema Aura OS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Segurança Global</h3>
              <p className="text-sm text-slate-500">RLS e Permissões</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            Pode forçar todos os utilizadores a re-autenticar ou alterar as políticas de RLS.
          </p>
          <button className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl border border-red-500/50 transition">
            Auditoria de Segurança
          </button>
        </div>

        <div className="bg-black border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Key className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">API Keys</h3>
              <p className="text-sm text-slate-500">Integrações de Terceiros</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            Gerencie as chaves da Stripe, Supabase e OpenAI.
          </p>
          <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-slate-700 transition">
            Gerir Chaves
          </button>
        </div>
      </div>
    </div>
  );
}
