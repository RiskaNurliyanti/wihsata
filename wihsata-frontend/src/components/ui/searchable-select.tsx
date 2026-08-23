'use client';

/**
 * Select dengan kotak pencarian ("ketik → cari → pilih") untuk daftar
 * panjang seperti kategori/kabupaten-kota. Mendukung mode form (uncontrolled,
 * via `name`+`defaultValue`, dibaca lewat FormData) dan mode controlled
 * (`value`+`onValueChange`, untuk filter berbasis URL param).
 */

import * as React from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  /** Mode form (uncontrolled): kirim value lewat hidden input `name`, dibaca via FormData. */
  name?: string;
  options: SearchableSelectOption[];
  defaultValue?: string | null;
  /** Mode controlled (mis. filter URL param): value & callback dikelola pemanggil, sama seperti Radix Select. */
  value?: string | null;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

export function SearchableSelect({
  name,
  options,
  defaultValue,
  value: controlledValue,
  onValueChange,
  placeholder = 'Pilih...',
  searchPlaceholder = 'Ketik untuk mencari...',
  emptyText = 'Tidak ditemukan.',
  className,
}: SearchableSelectProps) {
  const isControlled = controlledValue !== undefined;
  const [internalSelected, setInternalSelected] = React.useState<string | null>(defaultValue ?? null);
  const selected = isControlled ? controlledValue : internalSelected;

  function selectValue(v: string | null) {
    if (isControlled) {
      onValueChange?.(v ?? '');
    } else {
      setInternalSelected(v);
    }
  }

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedLabel = options.find((o) => o.value === selected)?.label ?? null;

  const filtered = React.useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {name && <input type="hidden" name={name} value={selected ?? ''} />}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background px-3.5 py-2 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <span className={cn(selectedLabel ? 'text-foreground' : 'text-muted-foreground')}>
          {selectedLabel ?? placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selected && (
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                selectValue(null);
              }}
              className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Hapus pilihan"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-elevated">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">{emptyText}</p>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    selectValue(option.value);
                    setOpen(false);
                    setQuery('');
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-sm hover:bg-primary-50 hover:text-primary-700',
                    option.value === selected && 'bg-primary-50 text-primary-700'
                  )}
                >
                  {option.label}
                  {option.value === selected && <Check className="h-3.5 w-3.5" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
