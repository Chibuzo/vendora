'use client';

import { useEffect } from 'react';

import type { Session } from '@/lib/auth';
import { clearAuth, setAuth } from '@/lib/api/client';
import { getSession } from '@/modules/auth/api/get-session';
import { refreshSession } from '@/modules/auth/api/refresh-session';
import { useAuthStore } from '@/modules/auth/store/use-auth-store';

interface AuthBootstrapProps {
  initialSession: Session | null;
}

export function AuthBootstrap({ initialSession }: Readonly<AuthBootstrapProps>) {
  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    if (!session) {
      clearAuth();
      return;
    }

    setAuth({
      accessToken: session.token,
      user: {
        id: session.user.id,
        email: session.user.email,
        fullName: session.user.name,
        authProvider: 'EMAIL',
        role: session.user.role.toUpperCase() as 'BUYER' | 'VENDOR' | 'ADMIN',
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  }, [session]);

  useEffect(() => {
    if (initialSession) {
      setSession(initialSession);
    }
  }, [initialSession, setSession]);

  useEffect(() => {
    let active = true;

    const syncSession = async () => {
      try {
        const response = await getSession();

        if (!active) {
          return;
        }

        if (response.session) {
          setSession(response.session);
          return;
        }

        clearSession();
      } catch {
        if (active) {
          clearSession();
        }
      } finally {
        if (active) {
          setHydrated(true);
        }
      }
    };

    void syncSession();

    return () => {
      active = false;
    };
  }, [clearSession, setHydrated, setSession]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const refreshDelay = new Date(session.expiresAt).getTime() - Date.now() - 60_000;

    const timer = window.setTimeout(async () => {
      try {
        const response = await refreshSession();
        setSession(response.session);
      } catch {
        clearSession();
      }
    }, Math.max(refreshDelay, 0));

    return () => {
      window.clearTimeout(timer);
    };
  }, [clearSession, session, setSession]);

  return null;
}
