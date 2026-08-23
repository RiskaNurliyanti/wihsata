import type { Metadata } from 'next';
import { apiFetch } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { AdminCommunityList } from '@/components/admin/admin-community-list';
import type { CommunityPost } from '@/types/database.types';

export const metadata: Metadata = { title: 'Moderasi Komunitas — Admin' };

async function getPosts(): Promise<CommunityPost[]> {
  const token = getServerToken();

  try {
    const res = await apiFetch<{ data: CommunityPost[] }>('/community/posts?per_page=100', { token });
    return res.data;
  } catch {
    return [];
  }
}

export default async function AdminCommunityPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Moderasi Komunitas</h1>
      <p className="mt-1 text-sm text-muted-foreground">{posts.length} postingan dari seluruh pengguna.</p>

      <AdminCommunityList posts={posts} />
    </div>
  );
}
