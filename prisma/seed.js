// prisma/seed.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      hashedPassword: 'not-real', // Replace or hash
    },
  })
}

main()
  .then(() => {
    console.log('Seeding complete.')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
