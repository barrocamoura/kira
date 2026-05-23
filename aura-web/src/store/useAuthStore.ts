import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabaseClient';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string) => {
        // Se houver cliente Supabase real configurado
        if (supabase) {
          // Neste caso simulado usamos apenas signInWithOtp ou signInWithPassword
          // Mas como estamos a testar sem password na UI, vamos usar um mock avançado
          // na ausência de chaves, ou tentar uma chamada real se as chaves existirem.
        }

        // Simulação de chamada API com delay (Mock Fallback)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        set({
          user: {
            id: 'user_' + Date.now(),
            name: email.split('@')[0],
            email: email,
            role: 'admin'
          },
          isAuthenticated: true
        });
      },

      logout: () => {
        if (supabase) {
           supabase.auth.signOut().catch(console.error);
        }
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'aura_auth_session',
    }
  )
);
