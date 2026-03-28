import { defineConfig } from 'orval'
import { env } from './src/config/env'

export default defineConfig({
    vendora: {
        input: {
            target: `${env.BACKEND_API_URL}/docs.json`,
        },
        output: {
            target: './src/shared/api/generated/endpoints.ts',
            schemas: './src/shared/api/generated/model',
            client: 'react-query',
        },
    },
})