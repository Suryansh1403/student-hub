import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Add 1 sample question
  const question = await prisma.question.create({
    data: {
      title: 'Add Two Numbers',
      description: `Given two integers, return their sum.`,
      difficulty: 'EASY',
      tags: ['Math', 'Implementation'],
      inputFormat: 'Two space-separated integers',
      outputFormat: 'Single integer',
      constraints: '1 <= a, b <= 10^6',
      examples: {
        create: [
          {
            input: '2 3',
            output: '5',
            explanation: '2 + 3 = 5',
          },
          {
            input: '100 200',
            output: '300',
            explanation: '100 + 200 = 300',
          },
        ],
      },
      testCases: {
        create: [
          {
            input: '500 600',
            output: '1100',
          },
          {
            input: '0 0',
            output: '0',
          },
          {
            input: '999999 1',
            output: '1000000',
          },
        ],
      },
    },
  });

  console.log('✅ Seeded question:', question.title);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
