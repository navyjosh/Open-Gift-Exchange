-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_exchangeId_fkey";

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "GiftExchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;
