import os

filepath = "src/app/dashboard/layout.tsx"
with open(filepath, "r") as f:
    content = f.read()

target_imports = "import React from 'react';"
replacement_imports = "\"use client\";\n\nimport React, { useEffect, useState } from 'react';\nimport { useRouter } from 'next/navigation';\nimport { useAuthStore } from '@/store/useAuthStore';"
content = content.replace(target_imports, replacement_imports)

target_component = "export default function DashboardLayout({ children }: { children: React.ReactNode }) {"
replacement_component = """export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono tracking-widest text-xs uppercase">A verificar credenciais de acesso...</div>;
  }"""
content = content.replace(target_component, replacement_component)

target_logout = """<a href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/50 hover:text-red-400 transition">
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </a>"""
replacement_logout = """<button onClick={() => { logout(); router.push('/login'); }} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/50 hover:text-red-400 transition w-full text-left">
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>"""
content = content.replace(target_logout, replacement_logout)

target_avatar = """<div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-sm">
                AL
              </div>"""
replacement_avatar = """<div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name.substring(0, 2).toUpperCase()}
              </div>"""
content = content.replace(target_avatar, replacement_avatar)

with open(filepath, "w") as f:
    f.write(content)
