import { z } from 'zod';

import {
    normalizeSession,
    normalizeSessionUser,
    type AuthCookiePayload,
    type Session,
    type SessionUser,
    type UserRole
} from '@/lib/auth';
import type { OtpChallenge, RequestOtpResponse } from '@/modules/auth/types';
import {
    createEmailUser,
    createPhoneUser,
    findUserByEmail,
    findUserById,
    findUserByPhone,
    mapUserToApiUser,
    mapUserToSessionUser,
    updateUserProfile,
    validateUserPassword
} from '@/modules/mock-marketplace/store';

const OTP_CODE = '123456';
const OTP_TTL_MS = 1000 * 60 * 5;
const RESEND_COOLDOWN_MS = 1000 * 30;
const ACCESS_TOKEN_TTL_MS = 1000 * 60 * 15;
const REFRESH_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

interface MockOtpChallengeRecord {
    challengeId: string;
    identifier: string;
    code: string;
    expiresAt: number;
    resendAvailableAt: number;
}

interface MockRefreshSessionRecord {
    identifier: string;
    role: UserRole;
    user: SessionUser;
    expiresAt: number;
}

type AuthPayloadShape = {
    session?: unknown;
    refreshToken?: unknown;
    refreshTokenExpiresAt?: unknown;
    token?: unknown;
    expiresAt?: unknown;
    user?: unknown;
    accessToken?: unknown;
    accessTokenExpiresAt?: unknown;
    tokens?: {
        refreshToken?: unknown;
        refreshTokenExpiresAt?: unknown;
        accessToken?: unknown;
        accessTokenExpiresAt?: unknown;
    };
};


const globalForAuthMock = globalThis as unknown as {
    __vendoraMockOtpChallenges: Map<string, MockOtpChallengeRecord>;
    __vendoraMockRefreshSessions: Map<string, MockRefreshSessionRecord>;
};

const mockOtpChallenges = globalForAuthMock.__vendoraMockOtpChallenges ?? new Map<string, MockOtpChallengeRecord>();
const mockRefreshSessions = globalForAuthMock.__vendoraMockRefreshSessions ?? new Map<string, MockRefreshSessionRecord>();

if (process.env.NODE_ENV !== 'production') {
    globalForAuthMock.__vendoraMockOtpChallenges = mockOtpChallenges;
    globalForAuthMock.__vendoraMockRefreshSessions = mockRefreshSessions;
}


export class AuthServiceError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly status: number
    ) {
        super(message);
        this.name = 'AuthServiceError';
    }
}

export const requestOtpSchema = z.object({
    identifier: z.string().trim().min(3, 'Enter a valid email or phone number.')
});

export const loginSchema = requestOtpSchema.extend({
    challengeId: z.string().trim().min(1, 'Request an OTP before continuing.'),
    otp: z
        .string()
        .trim()
        .length(6, 'OTP must contain 6 digits.')
        .refine((value) => /^\d+$/.test(value), 'OTP must contain only digits.')
});

export const emailSignupSchema = z.object({
    email: z.string().trim().email('Enter a valid email address.'),
    password: z.string().trim().min(8, 'Password must be at least 8 characters long.'),
    fullName: z.string().trim().min(2, 'Enter your full name.').optional()
});

export const emailLoginSchema = z.object({
    email: z.string().trim().email('Enter a valid email address.'),
    password: z.string().trim().min(8, 'Password must be at least 8 characters long.'),
});

export const phoneAuthSchema = z.object({
    phone: z.string().trim().min(10, 'Enter a valid phone number.')
});

export const phoneVerifySchema = phoneAuthSchema.extend({
    challengeId: z.string().trim().min(1, 'Request an OTP before continuing.'),
    otp: z
        .string()
        .trim()
        .length(6, 'OTP must contain 6 digits.')
        .refine((value) => /^\d+$/.test(value), 'OTP must contain only digits.')
});

export const completeSignupSchema = z.object({
    fullName: z.string().trim().min(2, 'Enter your full name.'),
    role: z.enum(['buyer', 'vendor']).optional()
});

function resolveRole(identifier: string): UserRole {
    if (identifier.includes('admin')) {
        return 'admin';
    }

    if (identifier.includes('vendor')) {
        return 'vendor';
    }

    return 'buyer';
}

function maskIdentifier(identifier: string) {
    if (identifier.includes('@')) {
        const [localPart, domain] = identifier.split('@');
        const maskedLocal = localPart.length <= 2 ? `${localPart[0] ?? ''}*` : `${localPart.slice(0, 2)}***`;
        return `${maskedLocal}@${domain}`;
    }

    const trimmed = identifier.replace(/\s+/g, '');

    if (trimmed.length <= 4) {
        return `${trimmed.slice(0, 1)}***`;
    }

    return `${trimmed.slice(0, 2)}***${trimmed.slice(-2)}`;
}

function buildMockSession(identifier: string, role: UserRole, user: SessionUser): Session {
    return {
        token: `mock_access_${role}_${crypto.randomUUID()}`,
        expiresAt: new Date(Date.now() + ACCESS_TOKEN_TTL_MS).toISOString(),
        user
    };
}

function createMockUser(identifier: string, role: UserRole): SessionUser {
    return {
        id: `${role}_001`,
        name: role === 'buyer' ? 'Marketplace Buyer' : `${role[0].toUpperCase()}${role.slice(1)} User`,
        role,
        email: identifier,
        tenantId: 'core'
    };
}

function createMockAuthPayload(identifier: string): AuthCookiePayload {
    const normalizedIdentifier = identifier.toLowerCase();
    const role = resolveRole(normalizedIdentifier);
    const user = createMockUser(identifier, role);
    const refreshToken = `mock_refresh_${role}_${crypto.randomUUID()}`;
    const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS).toISOString();
    const session = buildMockSession(identifier, role, user);

    mockRefreshSessions.set(refreshToken, {
        identifier,
        role,
        user,
        expiresAt: Date.parse(refreshTokenExpiresAt)
    });

    return {
        session,
        refreshToken,
        refreshTokenExpiresAt
    };
}

function issueAuthPayloadForUser(userId: string): AuthCookiePayload {
    const userRecord = findUserById(userId);

    if (!userRecord) {
        throw new AuthServiceError('Unable to resolve user account.', 'USER_NOT_FOUND', 404);
    }

    const role = userRecord.role.toLowerCase() as UserRole;
    const user = mapUserToSessionUser(userRecord);
    const refreshToken = `mock_refresh_${role}_${crypto.randomUUID()}`;
    const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS).toISOString();
    const session = buildMockSession(user.email, role, user);

    mockRefreshSessions.set(refreshToken, {
        identifier: user.email,
        role,
        user,
        expiresAt: Date.parse(refreshTokenExpiresAt)
    });

    return {
        session,
        refreshToken,
        refreshTokenExpiresAt
    };
}

function toOtpChallenge(record: MockOtpChallengeRecord): OtpChallenge {
    return {
        challengeId: record.challengeId,
        channel: record.identifier.includes('@') ? 'email' : 'sms',
        maskedDestination: maskIdentifier(record.identifier),
        expiresAt: new Date(record.expiresAt).toISOString(),
        resendAvailableAt: new Date(record.resendAvailableAt).toISOString()
    };
}

export function createMockOtpChallenge(identifier: string): RequestOtpResponse {
    const now = Date.now();
    const challengeId = crypto.randomUUID();
    const record: MockOtpChallengeRecord = {
        challengeId,
        identifier,
        code: OTP_CODE,
        expiresAt: now + OTP_TTL_MS,
        resendAvailableAt: now + RESEND_COOLDOWN_MS
    };

    mockOtpChallenges.set(challengeId, record);

    return {
        challenge: toOtpChallenge(record)
    };
}

export function verifyMockOtpLogin(payload: z.infer<typeof loginSchema>) {
    const challenge = mockOtpChallenges.get(payload.challengeId);

    if (!challenge || challenge.identifier !== payload.identifier) {
        throw new AuthServiceError('Request a new OTP before continuing.', 'CHALLENGE_NOT_FOUND', 400);
    }

    if (Date.now() > challenge.expiresAt) {
        mockOtpChallenges.delete(payload.challengeId);
        throw new AuthServiceError('The OTP has expired. Request a new code.', 'OTP_EXPIRED', 401);
    }

    if (payload.otp !== challenge.code) {
        throw new AuthServiceError('The provided OTP is invalid.', 'INVALID_OTP', 401);
    }

    mockOtpChallenges.delete(payload.challengeId);
    return createMockAuthPayload(payload.identifier);
}

function verifyOtpChallenge(identifier: string, challengeId: string, otp: string) {
    const challenge = mockOtpChallenges.get(challengeId);

    if (!challenge || challenge.identifier !== identifier) {
        throw new AuthServiceError('Request a new OTP before continuing.', 'CHALLENGE_NOT_FOUND', 400);
    }

    if (Date.now() > challenge.expiresAt) {
        mockOtpChallenges.delete(challengeId);
        throw new AuthServiceError('The OTP has expired. Request a new code.', 'OTP_EXPIRED', 401);
    }

    if (otp !== challenge.code) {
        throw new AuthServiceError('The provided OTP is invalid.', 'INVALID_OTP', 401);
    }

    mockOtpChallenges.delete(challengeId);
}

export function signupWithEmail(payload: z.infer<typeof emailSignupSchema>) {
    if (findUserByEmail(payload.email)) {
        throw new AuthServiceError('An account already exists for this email.', 'ACCOUNT_EXISTS', 409);
    }

    const user = createEmailUser(payload);
    return issueAuthPayloadForUser(user.id);
}

export function loginWithEmail(payload: z.infer<typeof emailLoginSchema>) {
    const user = findUserByEmail(payload.email);

    if (!user || !validateUserPassword(payload.email, payload.password)) {
        throw new AuthServiceError('Invalid email or password.', 'INVALID_CREDENTIALS', 401);
    }

    return issueAuthPayloadForUser(user.id);
}

export function requestPhoneOtp(payload: z.infer<typeof phoneAuthSchema>) {
    return createMockOtpChallenge(payload.phone);
}

export function verifyPhoneSignup(payload: z.infer<typeof phoneVerifySchema>) {
    verifyOtpChallenge(payload.phone, payload.challengeId, payload.otp);
    const existing = findUserByPhone(payload.phone);
    const user = existing ?? createPhoneUser({ phone: payload.phone });
    return issueAuthPayloadForUser(user.id);
}

export function verifyPhoneLogin(payload: z.infer<typeof phoneVerifySchema>) {
    verifyOtpChallenge(payload.phone, payload.challengeId, payload.otp);
    const existing = findUserByPhone(payload.phone);

    if (!existing) {
        throw new AuthServiceError('No account found for this phone number.', 'ACCOUNT_NOT_FOUND', 404);
    }

    return issueAuthPayloadForUser(existing.id);
}

export function completeMockSignup(
    userId: string,
    payload: z.infer<typeof completeSignupSchema>
) {
    const user = updateUserProfile(userId, {
        fullName: payload.fullName,
        role: payload.role ? payload.role.toUpperCase() as 'BUYER' | 'VENDOR' : undefined
    });

    return {
        auth: issueAuthPayloadForUser(user.id),
        user: mapUserToApiUser(user)
    };
}

export function refreshMockSession(refreshToken: string) {
    const stored = mockRefreshSessions.get(refreshToken);

    if (!stored) {
        throw new AuthServiceError('Your session has expired. Sign in again.', 'REFRESH_TOKEN_INVALID', 401);
    }

    if (Date.now() > stored.expiresAt) {
        mockRefreshSessions.delete(refreshToken);
        throw new AuthServiceError('Your session has expired. Sign in again.', 'REFRESH_TOKEN_EXPIRED', 401);
    }

    mockRefreshSessions.delete(refreshToken);
    return createMockAuthPayload(stored.identifier);
}

export function revokeMockRefreshToken(refreshToken?: string | null) {
    if (refreshToken) {
        mockRefreshSessions.delete(refreshToken);
    }
}

export function coerceOtpChallenge(payload: unknown): RequestOtpResponse {
    if (
        payload &&
        typeof payload === 'object' &&
        'challenge' in payload &&
        typeof (payload as { challenge: unknown }).challenge === 'object'
    ) {
        return payload as RequestOtpResponse;
    }

    if (
        payload &&
        typeof payload === 'object' &&
        'challengeId' in payload &&
        'expiresAt' in payload &&
        'resendAvailableAt' in payload &&
        'maskedDestination' in payload &&
        'channel' in payload
    ) {
        return {
            challenge: payload as OtpChallenge
        };
    }

    throw new AuthServiceError('Backend did not return a valid OTP challenge payload.', 'INVALID_AUTH_RESPONSE', 502);
}

export function coerceAuthPayload(payload: unknown, currentRefreshToken?: string | null): AuthCookiePayload {
    const candidate = payload as AuthPayloadShape;
    const resolvedSession =
        normalizeSession(candidate?.session) ??
        normalizeSession(payload) ??
        (typeof candidate?.accessToken === 'string' &&
            typeof candidate?.accessTokenExpiresAt === 'string' &&
            normalizeSessionUser(candidate?.user)
            ? ({
                token: candidate.accessToken,
                expiresAt: candidate.accessTokenExpiresAt,
                user: normalizeSessionUser(candidate.user)!
            } satisfies Session)
            : null);

    if (!resolvedSession) {
        throw new AuthServiceError('Backend did not return a valid session payload.', 'INVALID_AUTH_RESPONSE', 502);
    }

    const refreshToken =
        typeof candidate?.refreshToken === 'string'
            ? candidate.refreshToken
            : typeof candidate?.tokens?.refreshToken === 'string'
                ? candidate.tokens.refreshToken
                : currentRefreshToken ?? resolvedSession.token;

    const refreshTokenExpiresAt =
        typeof candidate?.refreshTokenExpiresAt === 'string'
            ? candidate.refreshTokenExpiresAt
            : typeof candidate?.tokens?.refreshTokenExpiresAt === 'string'
                ? candidate.tokens.refreshTokenExpiresAt
                : resolvedSession.expiresAt;

    return {
        session: resolvedSession,
        refreshToken,
        refreshTokenExpiresAt
    };
}
