'use client';

import { useCallback, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect } from 'react';
import type { Category, District } from '@/types/database.types';

interface ExploreFiltersProps {
  categories: Category[];
  districts: District[];
}

const SORT_OPTIONS = [
  { value: 'rating', label: 'Rating Tertinggi' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'name', label: 'Nama (A-Z)' },
];

export function ExploreFilters({ categories, districts }: ExploreFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const debouncedQuery = useDebounce(query, 500);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'all') params.set(key, value);
      else params.delete(key);
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (debouncedQuery !== (searchParams.get('q') ?? '')) {
      updateParam('q', debouncedQuery || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama destinasi..."
          className="pl-9"
        />
      </div>

      <SearchableSelect
        options={[{ value: 'all', label: 'Semua Kategori' }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]}
        value={searchParams.get('category') ?? 'all'}
        onValueChange={(v) => updateParam('category', v)}
        placeholder="Kategori"
        searchPlaceholder="Cari kategori..."
        className="w-full sm:w-48"
      />

      <SearchableSelect
        options={[{ value: 'all', label: 'Semua Kota' }, ...districts.map((d) => ({ value: d.id, label: d.name }))]}
        value={searchParams.get('district') ?? 'all'}
        onValueChange={(v) => updateParam('district', v)}
        placeholder="Kabupaten/Kota"
        searchPlaceholder="Cari kota... (mis. Samarinda)"
        className="w-full sm:w-48"
      />

      <Select defaultValue={searchParams.get('sort') ?? 'rating'} onValueChange={(v) => updateParam('sort', v)}>
        <SelectTrigger className="w-full sm:w-44">
          <SlidersHorizontal className="h-4 w-4 opacity-50" />
          <SelectValue placeholder="Urutkan" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" onClick={() => router.push(pathname)}>
        Reset
      </Button>
    </div>
  );
}
