const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  })

  const wishlist = await prisma.wishlist.create({
    data: {
      name: 'My Dev Wishlist',
      userId: user.id,
    },
  })

  await prisma.wishlistItem.createMany({
    data: [
      {
        name: 'Ergonomic Chair',
        link: 'https://example.com/chair',
        wishlistId: wishlist.id,
      },
      {
        name: 'Standing Desk',
        link: 'https://example.com/desk',
        wishlistId: wishlist.id,
      },
      {
        name: 'UltraWide Monitor',
        link: 'https://example.com/monitor',
        wishlistId: wishlist.id,
      },
    ],
  })

  console.log(`🌱 Seeded wishlist "${wishlist.name}" for user "${user.email}"`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
