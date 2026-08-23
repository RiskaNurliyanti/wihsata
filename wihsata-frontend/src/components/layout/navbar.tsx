'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Menu,
  X,
  MapPin,
  Sparkles,
  Map as MapIcon,
  Calendar,
  Users,
  BookOpen,
  Gem,
  UserCircle,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useCurrentProfile } from '@/hooks/use-current-profile';
import { apiFetch, clearClientToken } from '@/lib/api/client';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/nearby', label: 'Nearby', icon: MapPin },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/ai-planner', label: 'AI Planner', icon: Sparkles },
  { href: '/maps', label: 'Maps', icon: MapIcon },
  { href: '/my-trip', label: 'My Trip', icon: Calendar },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/pricing', label: 'Pricing', icon: Gem },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, role, effectiveTier, isLoading } = useCurrentProfile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  async function handleLogout() {
    // Panggil endpoint logout Laravel supaya token dicabut di server juga
    // (bukan cuma dihapus di client) — best-effort, tetap lanjut hapus
    // cookie lokal walau request gagal (token sudah expired dsb.).
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // diamkan — tetap lanjut hapus token lokal di bawah
    }
    clearClientToken();
    router.push('/');
    router.refresh();
  }

  const isAdmin = !!profile?.is_admin;
  const isSuperAdmin = role === 'super_admin';
  const adminLabel = isSuperAdmin ? 'Super Admin' : 'Admin';

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled ? 'bg-background/90 shadow-soft backdrop-blur-lg' : 'bg-background/60 backdrop-blur-sm'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary-700 dark:text-primary-400">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 text-white">
            <Compass className="h-5 w-5" />
          </div>
          Wihsata
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />

          {!isLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 transition-colors hover:bg-muted">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? 'User'} />
                    <AvatarFallback>{(profile?.full_name ?? user.email)?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                  </Avatar>
                  <Badge variant={isSuperAdmin ? 'pro' : isAdmin ? 'warning' : 'secondary'} className="hidden xl:inline-flex">
                    {isAdmin ? (
                      <>
                        <ShieldCheck className="h-3 w-3" /> {adminLabel}
                      </>
                    ) : (
                      'User'
                    )}
                  </Badge>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span className="truncate">{profile?.full_name ?? user.email}</span>
                  {effectiveTier === 'pro' && <Badge variant="pro">Pro</Badge>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserCircle className="h-4 w-4" /> Profil Saya
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-trip">
                    <Calendar className="h-4 w-4" /> My Trip
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !isLoading ? (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="gradient" size="sm">
                  Daftar Gratis
                </Button>
              </Link>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button className="p-2" onClick={() => setIsOpen((v) => !v)} aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
            <div className="container flex flex-col gap-1 py-4">
              {user && (
                <div className="mb-2 flex items-center gap-3 rounded-lg bg-muted px-3 py-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url ?? undefined} />
                    <AvatarFallback>{(profile?.full_name ?? user.email)?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{profile?.full_name ?? user.email}</p>
                    <div className="mt-0.5 flex gap-1.5">
                      <Badge variant={isSuperAdmin ? 'pro' : isAdmin ? 'warning' : 'secondary'}>{isAdmin ? adminLabel : 'User'}</Badge>
                      {effectiveTier === 'pro' && <Badge variant="pro">Pro</Badge>}
                    </div>
                  </div>
                </div>
              )}

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}

              {user && (
                <Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">
                  <UserCircle className="h-4 w-4" /> Profil Saya
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">
                  <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                </Link>
              )}

              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                {user ? (
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" /> Keluar
                  </Button>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="outline" className="w-full">
                        Masuk
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button variant="gradient" className="w-full">
                        Daftar Gratis
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
