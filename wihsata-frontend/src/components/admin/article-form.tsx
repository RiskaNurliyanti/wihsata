'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/shared/image-upload';
import { slugify } from '@/lib/utils';
import type { Article } from '@/types/database.types';
import type { ArticleFormState } from '@/lib/actions/blog.actions';

interface ArticleFormProps {
  action: (prevState: ArticleFormState, formData: FormData) => Promise<ArticleFormState>;
  article?: Article | null;
  submitLabel?: string;
  redirectTo?: string;
}

const initialState: ArticleFormState = { error: null, success: false };

const CATEGORY_OPTIONS = ['Tips Travel', 'Solo Travel', 'Budget Travel', 'Event & Culture', 'Kuliner'];

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="gradient" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? 'Menyimpan...' : label}
    </Button>
  );
}

export function ArticleForm({ action, article, submitLabel = 'Simpan', redirectTo = '/admin/blog' }: ArticleFormProps) {
  const router = useRouter();
  const [state, formAction] = useFormState(action, initialState);
  const [title, setTitle] = useState(article?.title ?? '');
  const [slug, setSlug] = useState(article?.slug ?? '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!article);
  // Cover artikel via upload file (bukan input URL manual).
  const [coverImageUrl, setCoverImageUrl] = useState(article?.cover_image_url ?? '');

  useEffect(() => {
    if (state.success) router.push(redirectTo);
  }, [state.success, router, redirectTo]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugManuallyEdited) setSlug(slugify(value));
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-5">
          <div>
            <Label htmlFor="title">Judul Artikel</Label>
            <Input id="title" name="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} required className="mt-1.5" />
          </div>

          <div>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugManuallyEdited(true);
              }}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Ringkasan Singkat</Label>
            <Textarea id="excerpt" name="excerpt" defaultValue={article?.excerpt ?? ''} rows={2} className="mt-1.5" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                name="category"
                defaultValue={article?.category ?? ''}
                className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="">Pilih kategori</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Foto Sampul</Label>
              <div className="mt-1.5">
                <ImageUpload
                  value={coverImageUrl || null}
                  onUploaded={(url) => setCoverImageUrl(url)}
                  onRemove={() => setCoverImageUrl('')}
                  label="Unggah Foto Sampul"
                />
              </div>
              <input type="hidden" name="cover_image_url" value={coverImageUrl} />
            </div>
          </div>

          <div>
            <Label htmlFor="content">Konten Artikel</Label>
            <Textarea id="content" name="content" defaultValue={article?.content ?? ''} rows={12} required className="mt-1.5" />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="is_published" defaultChecked={article?.is_published ?? true} className="h-4 w-4 rounded border-border" />
            Publikasikan sekarang
          </label>
          {!article && (
            <p className="text-xs text-muted-foreground">
              Kalau dicentang, artikel langsung bisa dibaca publik di halaman Blog. Kalau tidak, artikel
              tersimpan sebagai draft (hanya kamu yang bisa lihat) sampai dipublikasikan lewat halaman edit.
            </p>
          )}

          {state.error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <SubmitButton label={submitLabel} />
        </form>
      </CardContent>
    </Card>
  );
}
