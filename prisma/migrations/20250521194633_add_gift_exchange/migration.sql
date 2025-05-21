/*
  Warnings:

  - You are about to drop the `_GiftExchangeAdmins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GiftExchangeMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "_GiftExchangeAdmins" DROP CONSTRAINT "_GiftExchangeAdmins_A_fkey";

-- DropForeignKey
ALTER TABLE "_GiftExchangeAdmins" DROP CONSTRAINT "_GiftExchangeAdmins_B_fkey";

-- DropForeignKey
ALTER TABLE "_GiftExchangeMembers" DROP CONSTRAINT "_GiftExchangeMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_GiftExchangeMembers" DROP CONSTRAINT "_GiftExchangeMembers_B_fkey";

-- DropTable
DROP TABLE "_GiftExchangeAdmins";

-- DropTable
DROP TABLE "_GiftExchangeMembers";

-- CreateTable
CREATE TABLE "GiftExchangeMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "giftExchangeId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftExchangeMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GiftExchangeMember_userId_giftExchangeId_key" ON "GiftExchangeMember"("userId", "giftExchangeId");

-- AddForeignKey
ALTER TABLE "GiftExchangeMember" ADD CONSTRAINT "GiftExchangeMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftExchangeMember" ADD CONSTRAINT "GiftExchangeMember_giftExchangeId_fkey" FOREIGN KEY ("giftExchangeId") REFERENCES "GiftExchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
