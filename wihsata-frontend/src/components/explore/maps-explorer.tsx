'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Star, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MapViewDynamic } from '@/components/shared/map-view-dynamic';
import { useDebounce } from '@/hooks/use-debounce';
import type { Destination } from '@/types/database.types';

interface MapsExplorerProps {
  destinations: Destination[];
}

export function MapsExplorer({ destinations }: MapsExplorerProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Destination | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return destinations;
    return destinations.filter((d) => d.name.toLowerCase().includes(debouncedQuery.toLowerCase()));
  }, [destinations, debouncedQuery]);

  return (
    <div className="flex h-full flex-col md:flex-row">
      {/* Sidebar list */}
      <div className="flex h-1/2 w-full flex-col border-b border-border md:h-full md:w-96 md:border-b-0 md:border-r">
        <div className="border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari destinasi..." className="pl-9" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((dest) => (
            <button
              key={dest.id}
              onClick={() => setSelected(dest)}
              className="flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{dest.name}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{dest.address}</p>
                <div className="mt-1 flex items-center gap-1 text-xs font-medium text-amber-600">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  {dest.rating.toFixed(1)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative h-1/2 flex-1 md:h-full">
        <MapViewDynamic
          destinations={filtered}
          center={selected ? [selected.latitude, selected.longitude] : undefined}
          zoom={selected ? 14 : 5}
        />

        {selected && (
          <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-border bg-card p-4 shadow-elevated sm:right-auto sm:w-80">
            <p className="font-display font-semibold text-foreground">{selected.name}</p>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{selected.description}</p>
            <Link href={`/explore/${selected.slug}`} className="mt-2 inline-block text-sm font-medium text-primary-600 hover:underline">
              Lihat detail lengkap →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
