'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Loader2, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/shared/image-upload';
import { createPostAction, type CommunityActionState } from '@/lib/actions/community.actions';

const initialState: CommunityActionState = { error: null, success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="gradient" size="sm" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      {pending ? 'Memposting...' : 'Posting'}
    </Button>
  );
}

export function CreatePostForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(createPostAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  // Foto posting komunitas via upload file.
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setImageUrl('');
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form ref={formRef} action={formAction} className="space-y-3">
          <Textarea name="caption" placeholder="Bagikan momen perjalananmu..." rows={3} />
          <ImageUpload
            value={imageUrl || null}
            onUploaded={(url) => setImageUrl(url)}
            onRemove={() => setImageUrl('')}
            label="Tambah Foto (opsional)"
          />
          <input type="hidden" name="image_url" value={imageUrl} />
          {state.error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
