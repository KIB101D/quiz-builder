import express from 'express';
import { env } from './config/env.js';
import { createApp } from './create-app.js';
import { prisma } from './lib/prisma.js';

const corsOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());

// Root app: deployment-level settings. The API itself lives in `createApp`,
// which tests use directly. Vercel also detects this file as the Express entrypoint.
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // behind Vercel's / a hosting provider's proxy
app.use(createApp(corsOrigins));

// On Vercel the app runs as a serverless function: Vercel imports the default
// export and handles HTTP itself. Everywhere else we start a regular server.
if (!process.env.VERCEL) {
  const server = app.listen(env.PORT, () => {
    console.log(`Quiz Builder API listening on http://localhost:${env.PORT}`);
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

export default app;
