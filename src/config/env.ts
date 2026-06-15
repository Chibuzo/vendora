import { z } from 'zod';

const booleanFromEnv = z.preprocess((value) => {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();

        if (['true', '1', 'yes', 'on'].includes(normalized)) {
            return true;
        }

        if (['false', '0', 'no', 'off', ''].includes(normalized)) {
            return false;
        }
    }

    return value;
}, z.boolean());

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:4000'),
    NEXT_PUBLIC_API_BASE_PATH: z.string().default('/api'),
    BACKEND_API_URL: z.string().url().default('http://localhost:4000'),
    BACKEND_API_KEY: z.string().optional(),
    NEXT_PUBLIC_ENABLE_MOCKS: booleanFromEnv.default(false),
    TENANT_STRATEGY: z.enum(['subdomain', 'path']).default('path')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    throw new Error(`Invalid environment configuration: ${parsedEnv.error.message}`);
}

export const env = parsedEnv.data;
