'use client';

import { AlertCircle } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

interface GroupErrorProps {
  title: string;
  message: string;
  reset: () => void;
}

export function GroupError({ title, message, reset }: Readonly<GroupErrorProps>) {
  return (
    <div className="mx-auto flex min-h-[40vh] max-w-2xl items-center justify-center">
      <Card variant="elevated" className="w-full">
        <CardContent className="space-y-5 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger-100 text-danger-700">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">{title}</h2>
            <p className="text-sm leading-6 text-muted-foreground">{message}</p>
          </div>
          <div className="flex items-center justify-center">
            <Button onClick={reset}>Try again</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
