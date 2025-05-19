-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hashedPassword" TEXT;

-- AlterTable
ALTER TABLE "WishlistItem" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION;
