'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { resetPasswordAction, type AuthActionState } from '@/lib/actions/auth.actions';

const initialState: AuthActionState = { error: null };

interface ResetPasswordFormProps {
  token: string;
  email: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="gradient" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? 'Menyimpan...' : 'Simpan Password Baru'}
    </Button>
  );
}

export function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
  const [state, formAction] = useFormState(resetPasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="email" value={email} />

      <div>
        <Label htmlFor="password">Password Baru</Label>
        <div className="mt-1.5">
          <PasswordInput id="password" name="password" required minLength={8} placeholder="Minimal 8 karakter" />
        </div>
      </div>

      <div>
        <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
        <div className="mt-1.5">
          <PasswordInput
            id="confirm_password"
            name="confirm_password"
            required
            minLength={8}
            placeholder="Ulangi password baru"
          />
        </div>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
