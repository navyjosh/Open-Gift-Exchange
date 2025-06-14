/*
  Warnings:

  - You are about to drop the column `isActive` on the `Wishlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[defaultWishlistId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "defaultWishlistId" TEXT;

-- AlterTable
ALTER TABLE "Wishlist" DROP COLUMN "isActive";

-- CreateIndex
CREATE UNIQUE INDEX "User_defaultWishlistId_key" ON "User"("defaultWishlistId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_defaultWishlistId_fkey" FOREIGN KEY ("defaultWishlistId") REFERENCES "Wishlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
