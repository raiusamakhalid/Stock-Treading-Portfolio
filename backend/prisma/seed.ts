import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Usama Khalid',
      email: 'usama.khalid@example.com',
    },
  });

  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'FB', name: 'Meta Platforms Inc.' },
    { symbol: 'BABA', name: 'Alibaba Group' },
    { symbol: 'V', name: 'Visa Inc.' },
  ];

  for (const stock of stocks) {
    await prisma.stock.create({ data: stock });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
