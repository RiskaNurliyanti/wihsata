'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MapPinned,
  Users,
  BarChart3,
  ArrowLeft,
  BookOpen,
  MessagesSquare,
  Tags,
  Calendar,
  Menu,
  X,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/destinations', label: 'Destinasi', icon: MapPinned },
  { href: '/admin/categories', label: 'Kategori', icon: Tags },
  { href: '/admin/trips', label: 'Trips', icon: Calendar },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen },
  { href: '/admin/community', label: 'Komunitas', icon: MessagesSquare },
  { href: '/admin/users', label: 'Pengguna', icon: Users },
  { href: '/admin/analytics', label: 'Analitik', icon: BarChart3 },
  { href: '/admin/maintenance', label: 'Maintenance', icon: Wrench },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1 px-3">
      {ADMIN_NAV.map((item) => {
        const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      {/* Desktop sidebar — tetap statis di layar besar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:block">
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin Panel</p>
        </div>
        <NavLinks pathname={pathname} />
        <div className="mt-6 border-t border-border p-3">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Situs
          </Link>
        </div>
      </aside>

      {/* Mobile: tombol buka menu, sebelumnya TIDAK ADA sama sekali sehingga
          navigasi admin di HP tidak bisa diakses kecuali ketik URL manual. */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin Panel</p>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground"
          aria-label="Buka menu admin"
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-card shadow-elevated md:hidden"
            >
              <div className="flex items-center justify-between p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin Panel</p>
                <button onClick={() => setMobileOpen(false)} aria-label="Tutup menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              <div className="mt-6 border-t border-border p-3">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Situs
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
