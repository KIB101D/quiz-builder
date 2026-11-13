import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Not read eagerly, so `prisma generate` (postinstall) works before `.env` exists.
    url: process.env.DATABASE_URL ?? '',
  },
});
