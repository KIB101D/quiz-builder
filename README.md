# Quiz Builder

A full-stack app for building quizzes with three question types: **True/False**, **Short answer** and **Multiple choice** (several correct answers).

**Live demo:** [quiz-builder-kib101d.vercel.app](https://quiz-builder-kib101d.vercel.app)

> The demo has no authentication (none is required by the task), so anyone can create or delete quizzes. If the list is empty, create one at `/create`.

| Layer    | Stack                                                                               |
| -------- | ----------------------------------------------------------------------------------- |
| Backend  | Node.js, Express 5, TypeScript, Prisma 7, PostgreSQL, Zod                           |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, React Hook Form, Zod |
| Tooling  | ESLint, Prettier, Vitest + Supertest, Docker Compose (database)                     |

## Features

- **`/create`**: quiz title plus any number of questions. Questions can be added and removed, and their type can be switched (the text is kept). Multiple-choice questions have their own list of options. The same rules are validated on the client and on the server.
- **`/quizzes`**: every quiz with its title, question count and creation date. Click a card to open the quiz, or use the trash icon to delete it from the database and the page.
- **`/quizzes/:id`**: read-only view of the quiz structure with correct answers highlighted.
- Loading skeletons, error and 404 states, responsive layout.

## Prerequisites

- Node.js **20.19+** (22 LTS recommended)
- Docker (for PostgreSQL), or any local PostgreSQL 14+ instance

## Getting started

### 1. Database

```bash
docker compose up -d
```

This starts PostgreSQL 16 on `localhost:5432` (user `postgres`, password `postgres`, database `quiz_builder`).
If you use your own PostgreSQL instance, just adjust `DATABASE_URL` in the next step.

### 2. Backend

```bash
cd backend
cp .env.example .env      # adjust DATABASE_URL if needed
npm install               # also generates the Prisma client
npm run db:migrate        # applies migrations
npm run db:seed           # optional: adds a sample quiz
npm run dev               # http://localhost:4000
```

### 3. Frontend

In a second terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev               # http://localhost:3000
```

Open http://localhost:3000. It redirects to the quiz list.

## Environment variables

| File                  | Variable              | Default                                                                    |
| --------------------- | --------------------- | -------------------------------------------------------------------------- |
| `backend/.env`        | `DATABASE_URL`        | `postgresql://postgres:postgres@localhost:5432/quiz_builder?schema=public` |
|                       | `PORT`                | `4000`                                                                     |
|                       | `CORS_ORIGIN`         | `http://localhost:3000` (comma-separated list allowed)                     |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | `http://localhost:4000`                                                    |

`.env` files are git-ignored. Only the `.env.example` templates are committed.

## Creating a sample quiz

**Option A: seed script.** `npm run db:seed` in `backend/` creates _JavaScript Fundamentals_ with all three question types. The script is idempotent, so running it again won't create duplicates.

**Option B: UI.** Go to http://localhost:3000/create, enter a title, add questions and click **Create quiz**.

**Option C: API.**

```bash
curl -X POST http://localhost:4000/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Geography Basics",
    "questions": [
      { "type": "BOOLEAN", "text": "The Danube flows through Vienna.", "correctAnswer": true },
      { "type": "INPUT", "text": "What is the capital of Spain?", "correctAnswer": "Madrid" },
      {
        "type": "CHECKBOX",
        "text": "Which of these countries are in Europe?",
        "options": [
          { "text": "Portugal", "isCorrect": true },
          { "text": "Chile", "isCorrect": false },
          { "text": "Norway", "isCorrect": true }
        ]
      }
    ]
  }'
```

## API

| Method   | Endpoint       | Description                                               | Success              |
| -------- | -------------- | --------------------------------------------------------- | -------------------- |
| `POST`   | `/quizzes`     | Create a quiz                                             | `201` + created quiz |
| `GET`    | `/quizzes`     | List quizzes: `id`, `title`, `questionCount`, `createdAt` | `200`                |
| `GET`    | `/quizzes/:id` | Quiz with all questions and options                       | `200`                |
| `DELETE` | `/quizzes/:id` | Delete a quiz (questions and options cascade)             | `204`                |
| `GET`    | `/health`      | Health check                                              | `200`                |

Questions are a discriminated union by `type`:

```ts
{
  type: 'BOOLEAN';
  text: string;
  correctAnswer: boolean;
}
{
  type: 'INPUT';
  text: string;
  correctAnswer: string;
}
{
  type: 'CHECKBOX';
  text: string;
  options: {
    text: string;
    isCorrect: boolean;
  }
  [];
} // 2–10 options, ≥1 correct
```

Errors share one shape: `{ "message": string, "details"?: { path, message }[] }`. Responses use `400` for validation errors and malformed JSON, `404` for unknown quizzes or routes, and `500` for anything unexpected.

## Project structure

```
quiz-builder/
├── docker-compose.yml          # PostgreSQL
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Quiz → Question → Option (cascade delete)
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── prisma.config.ts
│   ├── src/
│   │   ├── config/env.ts       # validated environment variables
│   │   ├── lib/                # Prisma client, HttpError
│   │   ├── middleware/         # Zod validation, error handling
│   │   ├── modules/quizzes/    # routes → controller → service, schema, DTO mapper
│   │   ├── create-app.ts       # API app factory (used by tests)
│   │   └── index.ts            # entrypoint: local server / Vercel Function
│   └── tests/                  # Vitest + Supertest
└── frontend/
    └── src/
        ├── app/                # pages: /create, /quizzes, /quizzes/[id]
        ├── components/         # ui primitives, quiz form, list, detail
        ├── services/           # API client + quiz service
        ├── lib/                # form schema, helpers
        └── types/
```

### Design notes

- **Data model.** Answers are stored per question type: `booleanAnswer` / `textAnswer` columns on `Question`, and an `Option` table for multiple choice. A `position` column keeps the order of questions and options stable.
- **Validation.** The API validates every request with Zod (strings are trimmed, ids coerced). The frontend uses an equivalent Zod schema through React Hook Form, so users see errors before submitting.
- **Layering.** Routes handle HTTP, the controller extracts validated input, the service talks to Prisma and the mapper converts DB rows into a clean discriminated-union DTO. The service is mocked in the route tests, so they don't need a database.
- **Frontend data flow.** The list and detail pages fetch on the server (always fresh). Deleting happens in a client component that updates the list without a reload.

## Deployment (free tier)

The [live demo](https://quiz-builder-kib101d.vercel.app) runs on free plans: both apps on **Vercel** (Hobby) and PostgreSQL from **Prisma Postgres**, added through Vercel Storage. The backend is deployed as a Vercel Function (Express is detected automatically), so it does not sleep between requests.

The repository holds two Vercel projects, one per folder:

| Project  | Root Directory | Environment variables                                           |
| -------- | -------------- | --------------------------------------------------------------- |
| Backend  | `backend`      | `DATABASE_URL` (set by the database integration), `CORS_ORIGIN` |
| Frontend | `frontend`     | `NEXT_PUBLIC_API_URL`                                           |

1. **Backend project.** On Vercel, **Add New → Project**, import this repository and set **Root Directory** to `backend`.
2. **Database.** In the backend project open **Storage → Create Database → Prisma Postgres** (Neon works too) and connect it to the project. This adds `DATABASE_URL`. Deploy or redeploy: the build runs `prisma migrate deploy` (`vercel-build` script) and creates the tables.
3. **Frontend project.** Import the same repository again, set **Root Directory** to `frontend` and add `NEXT_PUBLIC_API_URL` = the backend's production domain (no trailing slash).
4. **CORS.** In the backend project add `CORS_ORIGIN` = the frontend's production domain (e.g. `https://quiz-builder-kib101d.vercel.app`) and redeploy.
5. **Sample data (optional).** Run the seed once from your machine against the production database:
   ```bash
   cd backend && DATABASE_URL="<production-connection-string>" npm run db:seed
   ```

> Use the production domains from **Settings → Domains**. Per-deployment URLs are protected by Vercel Authentication by default. `NEXT_PUBLIC_API_URL` is inlined at build time, so redeploy the frontend after changing it.

## Scripts

Both `backend/` and `frontend/` provide:

| Script                    | Purpose                |
| ------------------------- | ---------------------- |
| `npm run dev`             | Start in watch mode    |
| `npm run build` / `start` | Production build / run |
| `npm run lint`            | ESLint                 |
| `npm run format`          | Prettier (write)       |
| `npm run format:check`    | Prettier (check)       |
| `npm run typecheck`       | TypeScript             |

Backend only: `npm test`, `npm run db:migrate`, `npm run db:deploy`, `npm run db:seed`, `npm run db:studio`.
