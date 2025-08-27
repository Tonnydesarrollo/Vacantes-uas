"use client";

import Link from "next/link";
import Sidebar from "./components/Sidebar";
import { useAuth } from "../../../src/context/AuthContext";
import type { Rol } from "./components/Sidebar";

export default function DashboardPage() {
  const { user, perfil, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  const rol = (perfil?.rol as Rol) || "Usuario";
  const greetingName =
    (perfil as any)?.nombre ?? user?.displayName ?? "Usuario";

  const links =
    rol === "Administrador" || rol === "Moderador"
      ? [
          { title: "Usuarios", href: "/dashboard/usuarios" },
          { title: "Vacantes", href: "/dashboard/vacantes" },
          { title: "Empresas", href: "/dashboard/empresas" },
          { title: "Reportes", href: "/dashboard/reportes" },
        ]
      : [
          { title: "Vacantes", href: "/dashboard/vacantes" },
          { title: "Empresas", href: "/dashboard/empresas" },
          { title: "Reportes", href: "/dashboard/reportes" },
        ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar rol={rol} />
      <main className="flex-1 p-4 md:ml-64">
        <h1 className="mb-6 text-2xl font-semibold text-green-800">
          Hola, {greetingName}
          {perfil?.facultad ? ` · ${perfil.facultad}` : ""}
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block">
              <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm transition hover:bg-green-50 hover:shadow">
                <h2 className="text-lg font-medium text-green-700">{link.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
