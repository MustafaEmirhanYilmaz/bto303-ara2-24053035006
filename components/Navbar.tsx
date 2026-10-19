"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Layers, Activity, Home as HomeIcon, Plus, Sparkles } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Başlangıç", icon: HomeIcon },
    { href: "/categories", label: "Kategoriler", icon: Layers },
    { href: "/products", label: "Ürünler", icon: Package },
    { href: "/stock-movements", label: "Stok Hareketleri", icon: Activity },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent block leading-tight">
                Mini Katalog & Stok
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Canlı
              </span>
            </div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              BTÖ-303 Ara Uygulama 2
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Add Action Button */}
          <Link
            href="/stock-movements/new"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all duration-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Hızlı Stok</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
