"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../src/lib/firebase";
import Particles from "../../components/particles";

export default function LoginPage() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-uas-dark-green via-uas-indigo to-uas-dark-green">
      <Particles />
      <div className="relative z-10 rounded-xl bg-white/10 p-8 backdrop-blur-md">
        <h1 className="mb-4 text-center text-2xl font-bold text-uas-white">
          Iniciar sesión
        </h1>
        <button
          onClick={handleLogin}
          className="w-full rounded bg-uas-gold px-4 py-2 font-semibold text-uas-dark-green transition-colors hover:bg-uas-gold/90"
        >
          Ingresar con Google
        </button>
      </div>
    </main>
  );
}
