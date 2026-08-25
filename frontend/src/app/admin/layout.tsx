"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";

const links = [
  { href: "/admin", label: "Pedidos" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/categorias", label: "Categorias" },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { email, loading, logout, token } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !token && !isLogin) {
      router.replace("/admin/login");
    }
    if (!loading && token && isLogin) {
      router.replace("/admin");
    }
  }, [loading, token, isLogin, router]);

  if (loading) {
    return <div className="p-10 text-[var(--ink-soft)]">Carregando...</div>;
  }

  if (isLogin) {
    return <>{children}</>;
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#e8efe9]">
      <header className="border-b border-[var(--line)] bg-[var(--forest-deep)] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="display text-2xl">Mustafá Admin</p>
            <p className="text-xs text-[#b7c8be]">{email}</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "text-[var(--gold-soft)]" : "text-white/85"}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/" className="text-white/70">
              Ver site
            </Link>
            <button type="button" onClick={() => logout()} className="text-white/70">
              Sair
            </button>
          </nav>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
