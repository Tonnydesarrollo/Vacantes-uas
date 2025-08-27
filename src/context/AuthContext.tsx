"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

type Perfil = {
  rol: string;
  facultad: string;
  activo: boolean;
};

type AuthContextProps = {
  user: User | null;
  perfil: Perfil | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  signOutApp: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps>(null as any);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
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
    const ref = doc(db, "Usuarios", u.email);
    const snap = await getDoc(ref);
    if (!snap.exists() || !snap.data().activo) {
      await signOut(auth);
      clearSession();
      alert("No autorizado, contacta al administrador");
      return;
    }
    const data = snap.data() as Perfil;
    setUser(u);
    setPerfil(data);
    document.cookie = `session=${u.email}; path=/`;
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
