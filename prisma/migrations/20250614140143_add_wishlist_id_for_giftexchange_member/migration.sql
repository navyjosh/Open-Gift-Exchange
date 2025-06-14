-- AlterTable
ALTER TABLE "GiftExchangeMember" ADD COLUMN     "wishlistId" TEXT;

-- AddForeignKey
ALTER TABLE "GiftExchangeMember" ADD CONSTRAINT "GiftExchangeMember_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
