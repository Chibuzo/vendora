import { LoaderCircle } from 'lucide-react';

export function GuardFallback({ label }: Readonly<{ label: string }>) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="surface flex items-center gap-3 px-5 py-4 text-sm text-muted-foreground">
        <LoaderCircle className="h-4 w-4 animate-spin text-primary-700" />
        <span>{label}</span>
      </div>
    </div>
  );
}
