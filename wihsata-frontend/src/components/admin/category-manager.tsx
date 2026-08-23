'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Check, X, Loader2, AlertCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { slugify } from '@/lib/utils';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '@/lib/actions/category.actions';
import type { Category } from '@/types/database.types';

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Search kategori — client-side, daftar sudah ditampilkan penuh tanpa paginasi.
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.trim().toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setError(null);

    startTransition(async () => {
      const slug = slugify(newName);
      const result = await createCategoryAction(newName, newIcon, slug);
      if (result.error) {
        setError(result.error);
        return;
      }
      setCategories((prev) => [...prev, { id: crypto.randomUUID(), name: newName, slug, icon: newIcon || null, created_at: new Date().toISOString() }]);
      setNewName('');
      setNewIcon('');
      router.refresh();
    });
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon ?? '');
  }

  function saveEdit(categoryId: string) {
    setError(null);
    startTransition(async () => {
      const result = await updateCategoryAction(categoryId, editName, editIcon);
      if (result.error) {
        setError(result.error);
        return;
      }
      setCategories((prev) => prev.map((c) => (c.id === categoryId ? { ...c, name: editName, icon: editIcon || null } : c)));
      setEditingId(null);
      router.refresh();
    });
  }

  function handleDelete(categoryId: string, name: string) {
    const confirmed = window.confirm(`Hapus kategori "${name}"? Destinasi yang memakainya akan kehilangan kategori (tidak ikut terhapus).`);
    if (!confirmed) return;
    setError(null);

    startTransition(async () => {
      const result = await deleteCategoryAction(categoryId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      router.refresh();
    });
  }

  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nama kategori baru, mis. Danau" className="flex-1" />
            <Input value={newIcon} onChange={(e) => setNewIcon(e.target.value)} placeholder="Nama ikon (opsional, mis. droplet)" className="sm:w-56" />
            <Button type="submit" variant="gradient" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Tambah
            </Button>
          </form>
          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari kategori..."
          className="pl-9"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.length === 0 ? (
          <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
            Tidak ada kategori yang cocok dengan pencarian &quot;{searchQuery}&quot;.
          </p>
        ) : (
          filteredCategories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="flex items-center justify-between gap-2 pt-6">
              {editingId === cat.id ? (
                <div className="flex flex-1 flex-col gap-2">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 text-sm" />
                  <Input value={editIcon} onChange={(e) => setEditIcon(e.target.value)} placeholder="ikon" className="h-8 text-sm" />
                  <div className="flex gap-1">
                    <Button size="sm" className="h-7 px-2" onClick={() => saveEdit(cat.id)} disabled={isPending}>
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setEditingId(null)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-foreground">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(cat)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.name)} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-destructive dark:hover:bg-red-950/30">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}
