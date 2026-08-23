import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/api/session';
import { ProfileForm } from '@/components/shared/profile-form';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';
import type { Profile } from '@/types/database.types';

export const metadata: Metadata = { title: 'Profil Saya' };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/auth/login?redirect=/profile');

  const { user, effective_tier, is_admin } = session;

  const profile: Profile = {
    id: user.id,
    full_name: user.full_name,
    username: user.username,
    avatar_url: user.avatar_url,
    bio: user.bio,
    home_city: user.home_city,
    is_admin,
    created_at: '',
    updated_at: '',
  };

  return (
    <div className="container max-w-2xl py-10 sm:py-14">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold text-foreground">Profil Saya</h1>
        <Badge variant={is_admin ? 'warning' : 'secondary'}>
          {is_admin ? (
            <>
              <ShieldCheck className="h-3 w-3" /> Admin
            </>
          ) : (
            'User'
          )}
        </Badge>
        <Badge variant={effective_tier === 'pro' ? 'pro' : 'outline'}>
          {effective_tier === 'pro' ? 'Pro' : 'Demo'}
        </Badge>
      </div>

      {is_admin && (
        <p className="mt-2 text-sm text-muted-foreground">
          Sebagai admin, akun Anda otomatis mendapat akses penuh setara Pro tanpa biaya — termasuk AI Planner
          tanpa batas, download PDF, dan fitur eksklusif lainnya.
        </p>
      )}

      <p className="mt-1 text-sm text-muted-foreground">Email: {user.email}</p>

      <div className="mt-8">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
