-- DropForeignKey
ALTER TABLE "GiftExchangeMember" DROP CONSTRAINT "GiftExchangeMember_giftExchangeId_fkey";

-- AddForeignKey
ALTER TABLE "GiftExchangeMember" ADD CONSTRAINT "GiftExchangeMember_giftExchangeId_fkey" FOREIGN KEY ("giftExchangeId") REFERENCES "GiftExchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;
