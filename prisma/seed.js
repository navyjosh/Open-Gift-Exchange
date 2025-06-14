import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.giftExchangeMember.deleteMany()
  await prisma.invite.deleteMany()
  await prisma.giftExchange.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const adminPassword = await bcrypt.hash('admin', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      name: 'Admin User',
      hashedPassword: adminPassword,
    },
  })

  // Create other users
  const users = await Promise.all(
    ['alice@example.com', 'bob@example.com', 'carol@example.com'].map(
      async (email, index) =>
        await prisma.user.create({
          data: {
            email,
            name: email.split('@')[0],
            hashedPassword: await bcrypt.hash(`password${index + 1}`, 10),
          },
        })
    )
  )

  // Create wishlists for Alice and Bob
  const alice = users[0]
  const bob = users[1]

  const aliceWishlist = await prisma.wishlist.create({
    data: {
      name: 'Alice’s Wishlist',
      userId: alice.id,
    },
  })

  const bobWishlist = await prisma.wishlist.create({
    data: {
      name: 'Bob’s Wishlist',
      userId: bob.id,
    },
  })

  // Update Alice and Bob to set default wishlist
  await prisma.user.update({
    where: { id: alice.id },
    data: { defaultWishlistId: aliceWishlist.id },
  })

  await prisma.user.update({
    where: { id: bob.id },
    data: { defaultWishlistId: bobWishlist.id },
  })

  // Create gift exchange
  const exchange = await prisma.giftExchange.create({
    data: {
      name: 'Holiday Gift Swap',
      description: 'Secret Santa 2025!',
      date: new Date('2025-12-15'),
      maxSpend: 50.0,
    },
  })

  // Assign members
  await prisma.giftExchangeMember.createMany({
    data: [
      {
        userId: admin.id,
        giftExchangeId: exchange.id,
        role: 'ADMIN',
      },
      ...users.map((u) => ({
        userId: u.id,
        giftExchangeId: exchange.id,
        role: 'MEMBER',
      })),
    ],
  })

  console.log('Database seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
