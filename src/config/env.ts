import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:4000'),
    NEXT_PUBLIC_API_BASE_PATH: z.string().default('/api'),
    BACKEND_API_URL: z.string().url().default('http://localhost:4000'),
    BACKEND_API_KEY: z.string().optional(),
    NEXT_PUBLIC_ENABLE_MOCKS: z.coerce.boolean().default(true),
    TENANT_STRATEGY: z.enum(['subdomain', 'path']).default('path')
});

const parsedEnv = envSchema.safeParse({
    ...process.env,
    NEXT_PUBLIC_ENABLE_MOCKS:
        process.env.NEXT_PUBLIC_ENABLE_MOCKS ??
        (process.env.NODE_ENV === 'production' ? 'false' : 'true')
});

if (!parsedEnv.success) {
    throw new Error(`Invalid environment configuration: ${parsedEnv.error.message}`);
}

export const env = parsedEnv.data;
