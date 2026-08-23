'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { User, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { registerAction, type AuthActionState } from '@/lib/actions/auth.actions';
import { registerSchema } from '@/lib/validations/auth.schema';

const initialState: AuthActionState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="gradient" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? 'Memproses...' : 'Daftar Gratis'}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, initialState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /**
   * PENTING: form ini submit native ke Server Action (`action={formAction}`).
   * Kita TIDAK memakai react-hook-form `handleSubmit` di sini karena handler
   * bawaannya selalu memanggil `event.preventDefault()` — akibatnya submit
   * native ke Server Action tidak pernah terkirim (form terlihat diam saja).
   * Solusinya: validasi manual pakai Zod dari FormData. Kalau valid, jangan
   * panggil preventDefault sama sekali sehingga browser lanjut submit native.
   */
  function handleValidate(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const values = {
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirm_password: formData.get('confirm_password'),
    };

    const result = registerSchema.safeParse(values);

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
    // valid — biarkan submit native berjalan ke Server Action
  }

  return (
    <form action={formAction} onSubmit={handleValidate} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Nama Lengkap</Label>
        <div className="relative mt-1.5">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="full_name" name="full_name" placeholder="Nama Lengkap" className="pl-9" />
        </div>
        {fieldErrors.full_name && <p className="mt-1 text-xs text-destructive">{fieldErrors.full_name}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <div className="relative mt-1.5">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="email" name="email" type="email" placeholder="nama@email.com" className="pl-9" />
        </div>
        {fieldErrors.email && <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="mt-1.5">
          <PasswordInput id="password" name="password" placeholder="Minimal 8 karakter" />
        </div>
        {fieldErrors.password && <p className="mt-1 text-xs text-destructive">{fieldErrors.password}</p>}
      </div>

      <div>
        <Label htmlFor="confirm_password">Konfirmasi Password</Label>
        <div className="mt-1.5">
          <PasswordInput id="confirm_password" name="confirm_password" placeholder="Ulangi password" />
        </div>
        {fieldErrors.confirm_password && <p className="mt-1 text-xs text-destructive">{fieldErrors.confirm_password}</p>}
      </div>

      {state.error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <SubmitButton />

      <p className="text-center text-xs text-muted-foreground">
        Dengan mendaftar, Anda menyetujui{' '}
        <a href="/terms" className="underline">
          Ketentuan Layanan
        </a>{' '}
        kami.
      </p>
    </form>
  );
}

