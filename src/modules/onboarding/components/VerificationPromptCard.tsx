'use client';

import type { Route } from 'next';
import Link from 'next/link';

import { routes } from '@/shared/constants/routes';
import { Badge } from '@/shared/components/ui/badge';
import { buttonVariants } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface VerificationPromptCardProps {
  status?: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
}

const copy = {
  UNVERIFIED: {
    title: 'Get verified to increase buyer trust.',
    description: 'Your store is live. Verification adds stronger trust signals for buyers.'
  },
  PENDING: {
    title: 'Verification is under review.',
    description: 'We will update your trust status after the submitted documents are checked.'
  },
  VERIFIED: {
    title: 'Your store is verified.',
    description: 'Buyers can see stronger trust signals on your storefront and products.'
  },
  REJECTED: {
    title: 'Verification needs attention.',
    description: 'Review your details and submit updated proof to improve buyer trust.'
  }
} as const;

export function VerificationPromptCard({ status = 'UNVERIFIED' }: Readonly<VerificationPromptCardProps>) {
  const content = copy[status];
  const canStart = status === 'UNVERIFIED' || status === 'REJECTED';

  return (
    <Card>
      <CardHeader>
        <Badge variant={status === 'VERIFIED' ? 'success' : status === 'PENDING' ? 'warning' : 'secondary'}>
          {status.replace('-', ' ')}
        </Badge>
        <CardTitle className="mt-3 text-2xl">{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>
      {canStart ? (
        <CardContent className="pt-0">
          <Link href={routes.vendor.verification as Route} className={buttonVariants()}>
            Start verification
          </Link>
        </CardContent>
      ) : null}
    </Card>
  );
}
