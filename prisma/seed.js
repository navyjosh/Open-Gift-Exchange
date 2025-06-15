import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'


async function main() {
  // Clear existing data
  await prisma.giftExchangeMember.deleteMany()
  await prisma.invite.deleteMany()
  await prisma.giftExchange.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const adminPassword = await bcrypt.hash('adminpassword', 10)
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

  // Create wishlists for two users
  const [alice, bob] = users

  const aliceWishlist = await prisma.wishlist.create({
    data: {
      name: "Alice's Wishlist",
      userId: alice.id,
    },
  })

// Add items to Alice's wishlist
  await prisma.wishlistItem.createMany({
  data: [
    {
      name: 'Cozy Blanket',
      link: 'https://example.com/cozy-blanket',
      price: 29.99,
      notes: 'Prefer gray or blue',
      wishlistId: aliceWishlist.id,
    },
    {
      name: 'Novelty Mug',
      link: 'https://example.com/funny-mug',
      price: 14.99,
      notes: 'Something funny or cute',
      wishlistId: aliceWishlist.id,
    },
  ],
  })

  const bobWishlist = await prisma.wishlist.create({
    data: {
      name: "Bob's Wishlist",
      userId: bob.id,
    },
  })

  // Set those as their default
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

  // Assign members with wishlists
  await prisma.giftExchangeMember.createMany({
    data: [
      {
        userId: admin.id,
        giftExchangeId: exchange.id,
        role: 'ADMIN',
      },
      {
        userId: alice.id,
        giftExchangeId: exchange.id,
        role: 'MEMBER',
        wishlistId: aliceWishlist.id,
      },
      {
        userId: bob.id,
        giftExchangeId: exchange.id,
        role: 'MEMBER',
        wishlistId: bobWishlist.id,
      },
      {
        userId: users[2].id, // Carol
        giftExchangeId: exchange.id,
        role: 'MEMBER',
      },
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
