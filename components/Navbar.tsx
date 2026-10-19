"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Layers, Activity, Home as HomeIcon } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Başlangıç", icon: HomeIcon },
    { href: "/categories", label: "Kategoriler", icon: Layers },
    { href: "/products", label: "Ürünler", icon: Package },
    { href: "/stock-movements", label: "Stok Hareketleri", icon: Activity },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-indigo-600 rounded-lg text-white group-hover:bg-indigo-500 transition shadow-sm shadow-indigo-500/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-white block leading-tight">Mini Katalog & Stok</span>
            <span className="text-[11px] text-slate-400">BTÖ-303 Ara Uygulama 2</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
