import { z } from 'zod';

import type { Session, UserRole } from '@/lib/auth';

export const loginSchema = z.object({
  identifier: z.string().min(3, 'Enter a valid email or phone number.'),
  otp: z
    .string()
    .length(6, 'OTP must contain 6 digits.')
    .refine((value) => /^\d+$/.test(value), 'OTP must contain only digits.')
});

function resolveRole(identifier: string): UserRole {
  if (identifier.includes('admin')) {
    return 'admin';
  }

  if (identifier.includes('vendor')) {
    return 'vendor';
  }

  return 'customer';
}

export function createMockSession(identifier: string): Session {
  const role = resolveRole(identifier.toLowerCase());

  return {
    token: `mock_session_${role}`,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    user: {
      id: `${role}_001`,
      name: role === 'customer' ? 'Marketplace Buyer' : `${role[0].toUpperCase()}${role.slice(1)} User`,
      role,
      email: identifier,
      tenantId: 'core'
    }
  };
}
