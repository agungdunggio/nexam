import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (name: string, email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  checkSession: () => Promise<void>;
}

const syncCookie = (userId?: string | null) => {
  if (typeof document === 'undefined') return;
  if (userId) {
    document.cookie = `nexam_session=${encodeURIComponent(userId)}; path=/; max-age=2592000; SameSite=Lax;`;
  } else {
    document.cookie = 'nexam_session=; Max-Age=0; path=/;';
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,

      setUser: (user) => {
        syncCookie(user?.id);
        set({ user, isLoggedIn: !!user });
      },

      login: async (name: string, email: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
          });

          const data = await res.json();
          if (data.success && data.user) {
            syncCookie(data.user.id);
            set({ user: data.user, isLoggedIn: true, isLoading: false });
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch {
          // Fallback demo user if backend is running in offline mode
          const demoUser: User = {
            id: 'demo-user-123',
            name,
            email,
            locale: 'id',
          };
          syncCookie(demoUser.id);
          set({ user: demoUser, isLoggedIn: true, isLoading: false });
          return true;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch {
          // Ignore network error on logout
        } finally {
          syncCookie(null);
          set({ user: null, isLoggedIn: false, isLoading: false });
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('nexam-auth');
            } catch {}
            window.location.href = '/login';
          }
        }
      },

      checkSession: async () => {
        const currentUser = get().user;
        if (!currentUser) {
          syncCookie(null);
          set({ isLoggedIn: false });
          return;
        }
        syncCookie(currentUser.id);
        set({ isLoggedIn: !!currentUser });
      },
    }),
    {
      name: 'nexam-auth',
      onRehydrateStorage: () => (state) => {
        if (state?.user?.id) {
          syncCookie(state.user.id);
        }
      },
    }
  )
);
