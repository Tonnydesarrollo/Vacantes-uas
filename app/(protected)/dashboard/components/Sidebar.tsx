"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export type Rol = "Administrador" | "Moderador" | "Usuario";

export default function Sidebar({ rol }: { rol: Rol }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links =
    rol === "Administrador" || rol === "Moderador"
      ? [
          { label: "Usuarios", href: "/dashboard/usuarios" },
          { label: "Vacantes", href: "/dashboard/vacantes" },
          { label: "Empresas", href: "/dashboard/empresas" },
          { label: "Reportes", href: "/dashboard/reportes" },
        ]
      : [
          { label: "Vacantes", href: "/dashboard/vacantes" },
          { label: "Empresas", href: "/dashboard/empresas" },
          { label: "Reportes", href: "/dashboard/reportes" },
        ];

  return (
    <>
      <button
        className="fixed left-4 top-4 z-30 rounded-md border bg-white p-2 text-green-700 shadow md:hidden"
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir menú"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-20 w-64 border-r bg-white shadow transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          "md:static md:block"
        )}
      >
        <div className="border-b p-4 text-center text-2xl font-bold text-green-700">
          VACANTES UAS
        </div>
        <nav className="space-y-1 p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={clsx(
                "block rounded-md px-3 py-2 text-sm font-medium hover:bg-green-50",
                pathname.startsWith(link.href)
                  ? "bg-green-100 text-green-700"
                  : "text-gray-700"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
