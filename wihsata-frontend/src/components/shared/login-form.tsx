'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { Mail, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { loginAction, type AuthActionState } from '@/lib/actions/auth.actions';

const initialState: AuthActionState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="gradient" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? 'Memproses...' : 'Masuk'}
    </Button>
  );
}

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirect" value={redirectTo ?? '/my-trip'} />

      <div>
        <Label htmlFor="email">Email</Label>
        <div className="relative mt-1.5">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="email" name="email" type="email" required placeholder="nama@email.com" className="pl-9" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/auth/forgot-password" className="text-xs font-medium text-primary-600 hover:underline">
            Lupa password?
          </Link>
        </div>
        <div className="mt-1.5">
          <PasswordInput id="password" name="password" required placeholder="••••••••" />
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