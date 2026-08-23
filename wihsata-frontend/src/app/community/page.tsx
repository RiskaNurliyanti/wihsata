import type { Metadata } from 'next';
import { apiFetch } from '@/lib/api/client';
import { CommunityFeed } from '@/components/shared/community-feed';
import type { CommunityPost } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Bagikan pengalaman perjalananmu dan temukan inspirasi dari traveler lain.',
};

async function getPosts(): Promise<CommunityPost[]> {
  try {
    const res = await apiFetch<{ data: CommunityPost[] }>('/community/posts?per_page=30', { skipAuth: true });
    return res.data;
  } catch (error) {
    console.error('CommunityPage: gagal memuat postingan:', error);
    return [];
  }
}

export default async function CommunityPage() {
  const posts = await getPosts();

  return (
    <div className="container py-10 sm:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">Community</h1>
        <p className="mt-2 text-muted-foreground">
          Bagikan momen perjalananmu dan dapatkan inspirasi dari sesama traveler.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <CommunityFeed initialPosts={posts} />
      </div>
    </div>
  );
}
