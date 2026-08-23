'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/shared/image-upload';
import { updateProfileAction, type ProfileActionState } from '@/lib/actions/profile.actions';
import { profileSchema } from '@/lib/validations/profile.schema';
import type { Profile } from '@/types/database.types';

const initialState: ProfileActionState = { error: null, success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="gradient" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
    </Button>
  );
}

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const [state, formAction] = useFormState(updateProfileAction, initialState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url ?? '');

  useEffect(() => {
    if (state.success) router.refresh();
  }, [state.success, router]);

  function handleValidate(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const values = {
      full_name: formData.get('full_name'),
      username: formData.get('username') || '',
      bio: formData.get('bio') || '',
      home_city: formData.get('home_city') || '',
      avatar_url: formData.get('avatar_url') || '',
    };

    const result = profileSchema.safeParse(values);
    if (!result.success) {
      e.preventDefault();
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} onSubmit={handleValidate} className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-border">
              <AvatarImage src={avatarPreview || undefined} />
              <AvatarFallback className="text-lg">{profile?.full_name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label>Foto Profil</Label>
              <div className="mt-1.5">
                <ImageUpload
                  value={null}
                  onUploaded={(url) => setAvatarPreview(url)}
                  label="Ganti Foto Profil"
                />
              </div>
              <input type="hidden" name="avatar_url" value={avatarPreview} />
              {fieldErrors.avatar_url && <p className="mt-1 text-xs text-destructive">{fieldErrors.avatar_url}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ''} className="mt-1.5" />
              {fieldErrors.full_name && <p className="mt-1 text-xs text-destructive">{fieldErrors.full_name}</p>}
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="mis. dita_ayu" defaultValue={profile?.username ?? ''} className="mt-1.5" />
              {fieldErrors.username && <p className="mt-1 text-xs text-destructive">{fieldErrors.username}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="home_city">Kota Asal</Label>
            <Input id="home_city" name="home_city" defaultValue={profile?.home_city ?? ''} className="mt-1.5" />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" defaultValue={profile?.bio ?? ''} rows={3} className="mt-1.5" placeholder="Ceritakan sedikit tentang dirimu..." />
            {fieldErrors.bio && <p className="mt-1 text-xs text-destructive">{fieldErrors.bio}</p>}
          </div>

          {state.error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}
          {state.success && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Profil berhasil diperbarui.
            </div>
          )}

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
