"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSupabase } from "./supabase";

type AdminAuthValue = {
  email: string | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const supabase = getSupabase();
      supabase.auth.getSession().then(({ data }) => {
        setEmail(data.session?.user.email ?? null);
        setToken(data.session?.access_token ?? null);
        setLoading(false);
      });

      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setEmail(session?.user.email ?? null);
        setToken(session?.access_token ?? null);
      });

      return () => sub.subscription.unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AdminAuthValue>(
    () => ({
      email,
      token,
      loading,
      login: async (loginEmail, password) => {
        const supabase = getSupabase();
        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });
        if (error) throw new Error(error.message);
      },
      logout: async () => {
        const supabase = getSupabase();
        await supabase.auth.signOut();
      },
    }),
    [email, token, loading]
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
