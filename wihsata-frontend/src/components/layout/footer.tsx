import Link from 'next/link';
import { Compass, Instagram, Twitter, Youtube } from 'lucide-react';

const FOOTER_LINKS = {
  Produk: [
    { href: '/explore', label: 'Explore Destinasi' },
    { href: '/ai-planner', label: 'AI Trip Planner' },
    { href: '/maps', label: 'Maps Interaktif' },
    { href: '/pricing', label: 'Demo vs Pro' },
  ],
  Komunitas: [
    { href: '/community', label: 'Community Feed' },
    { href: '/blog', label: 'Blog Travel' },
    { href: '/blog?category=solo-travel', label: 'Solo Travel' },
    { href: '/blog?category=budget-travel', label: 'Budget Travel' },
  ],
  Perusahaan: [
    { href: '/about', label: 'Tentang Kami' },
    { href: '/pricing', label: 'Harga' },
    { href: '/contact', label: 'Kontak' },
    { href: '/privacy', label: 'Kebijakan Privasi' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary-950 text-primary-100">
      <div className="container py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
                <Compass className="h-5 w-5" />
              </div>
              Wihsata
            </Link>
            <p className="mt-3 max-w-xs text-sm text-primary-300">
              Temukan, rencanakan, dan jelajahi destinasi wisata terbaik dengan bantuan AI — dari pantai
              tersembunyi hingga kuliner legendaris.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Instagram" className="rounded-full bg-primary-900 p-2 hover:bg-primary-800">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="rounded-full bg-primary-900 p-2 hover:bg-primary-800">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Youtube" className="rounded-full bg-primary-900 p-2 hover:bg-primary-800">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white">{title}</h4>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-primary-300 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-primary-900 pt-6 text-sm text-primary-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Wihsata. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privasi
            </Link>
            <Link href="/terms" className="hover:text-white">
              Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
