'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { profileSchema } from '@/lib/validations/profile.schema';

export interface ProfileActionState {
  error: string | null;
  success: boolean;
}

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const token = getServerToken();

  if (!token) {
    return { error: 'Anda harus login untuk mengubah profil.', success: false };
  }

  const raw = {
    full_name: formData.get('full_name') as string,
    username: (formData.get('username') as string) || '',
    bio: (formData.get('bio') as string) || '',
    home_city: (formData.get('home_city') as string) || '',
    avatar_url: (formData.get('avatar_url') as string) || '',
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.', success: false };
  }

  try {
    await apiFetch('/auth/me', {
      method: 'PATCH',
      token,
      json: {
        full_name: parsed.data.full_name,
        username: parsed.data.username || null,
        bio: parsed.data.bio || null,
        home_city: parsed.data.home_city || null,
        avatar_url: parsed.data.avatar_url || null,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.firstFieldError() ?? error.message, success: false };
    }
    return { error: 'Gagal memperbarui profil. Coba lagi.', success: false };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/profile');
  return { error: null, success: true };
}
