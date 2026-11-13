import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const SAMPLE_TITLE = 'JavaScript Fundamentals';

async function main() {
  // Keep the seed idempotent: re-running it does not create duplicates.
  await prisma.quiz.deleteMany({ where: { title: SAMPLE_TITLE } });

  const quiz = await prisma.quiz.create({
    data: {
      title: SAMPLE_TITLE,
      questions: {
        create: [
          {
            position: 0,
            type: 'BOOLEAN',
            text: 'JavaScript is a single-threaded language.',
            booleanAnswer: true,
          },
          {
            position: 1,
            type: 'INPUT',
            text: 'Which keyword declares a block-scoped variable that cannot be reassigned?',
            textAnswer: 'const',
          },
          {
            position: 2,
            type: 'CHECKBOX',
            text: 'Which of the following are primitive types in JavaScript?',
            options: {
              create: [
                { position: 0, text: 'string', isCorrect: true },
                { position: 1, text: 'object', isCorrect: false },
                { position: 2, text: 'symbol', isCorrect: true },
                { position: 3, text: 'bigint', isCorrect: true },
              ],
            },
          },
          {
            position: 3,
            type: 'BOOLEAN',
            text: 'typeof null returns "null".',
            booleanAnswer: false,
          },
        ],
      },
    },
  });

  console.log(`Seeded quiz "${quiz.title}" (id: ${quiz.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
