import { Wrench } from 'lucide-react';

export function MaintenancePage({ message }: { message: string }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950/40">
          <Wrench className="h-8 w-8 text-primary-600" />
        </div>
        {message.split('\n').map((line, i) =>
          line.trim() ? (
            i === 0 ? (
              <h1 key={i} className="font-display text-2xl font-bold text-foreground">
                {line}
              </h1>
            ) : (
              <p key={i} className="mt-3 text-muted-foreground">
                {line}
              </p>
            )
          ) : null
        )}
      </div>
    </div>
  );
}
