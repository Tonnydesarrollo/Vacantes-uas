"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { getPerfilByEmail } from "../services/usuarios";
import type { Usuario } from "../types";

type AuthContextProps = {
  user: User | null;
  perfil: Usuario | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  signOutApp: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    setUser(null);
    setPerfil(null);
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  const verifyUser = async (u: User) => {
    if (!u.email) {
      await signOut(auth);
      clearSession();
      alert("No autorizado, contacta al administrador");
      return;
    }
    try {
      const data = await getPerfilByEmail(u.email);
      if (!data || !data.activo) {
        await signOut(auth);
        clearSession();
        alert("No autorizado, contacta al administrador");
        return;
      }
      setUser(u);
      setPerfil(data);
      document.cookie = `session=${u.email}; path=/`;
    } catch (error) {
      await signOut(auth);
      clearSession();
      alert("Error verificando al usuario, intenta de nuevo");
    }
  };

  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, async (u) => {
      if (u) {
        await verifyUser(u);
      } else {
        clearSession();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOutApp = async () => {
    await signOut(auth);
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{ user, perfil, loading, signInGoogle, signOutApp }}
    >
      {children}
    </AuthContext.Provider>
  );
}
