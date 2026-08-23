'use client';

/**
 * Komponen upload foto reusable — dipakai di form destinasi, artikel, dan
 * posting komunitas. Membuka file picker, upload ke POST /api/uploads,
 * lalu memanggil onUploaded(url) dengan URL hasil upload. File disimpan
 * apa adanya tanpa kompresi/resize.
 */

import * as React from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string | null;
  onUploaded: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onUploaded, onRemove, label = 'Unggah Foto', className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await apiFetch<{ data: { url: string; path: string } }>('/uploads', {
        method: 'POST',
        body: formData,
      });

      onUploaded(result.data.url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal mengunggah foto. Coba lagi.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element -- preview file yang baru diupload, bisa dari domain storage mana pun */}
          <img src={value} alt="Preview" className="h-32 w-32 rounded-lg border border-border object-cover" />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white shadow"
              aria-label="Hapus foto"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex h-32 w-32 flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary-400 hover:text-primary-600 disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          <span className="text-xs">{isUploading ? 'Mengunggah...' : label}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
