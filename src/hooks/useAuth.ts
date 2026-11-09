'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { user, isLoggedIn, isLoading, login, logout, setUser, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
    setUser,
  };
}
