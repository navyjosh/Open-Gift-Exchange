/*
  Warnings:

  - A unique constraint covering the columns `[assignedToId]` on the table `GiftExchangeMember` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GiftExchangeMember" ADD COLUMN     "assignedToId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GiftExchangeMember_assignedToId_key" ON "GiftExchangeMember"("assignedToId");

-- AddForeignKey
ALTER TABLE "GiftExchangeMember" ADD CONSTRAINT "GiftExchangeMember_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "GiftExchangeMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
