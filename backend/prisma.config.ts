import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Migrations need a direct connection. Neon's Vercel integration provides it as
    // DATABASE_URL_UNPOOLED; locally DATABASE_URL is used.
    // Not read eagerly, so `prisma generate` (postinstall) works before `.env` exists.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? '',
  },
});
