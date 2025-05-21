-- CreateTable
CREATE TABLE "GiftExchange" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxSpend" DOUBLE PRECISION,
    "date" TIMESTAMP(3),
    "time" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftExchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GiftExchangeMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GiftExchangeMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GiftExchangeAdmins" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GiftExchangeAdmins_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GiftExchangeMembers_B_index" ON "_GiftExchangeMembers"("B");

-- CreateIndex
CREATE INDEX "_GiftExchangeAdmins_B_index" ON "_GiftExchangeAdmins"("B");

-- AddForeignKey
ALTER TABLE "_GiftExchangeMembers" ADD CONSTRAINT "_GiftExchangeMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "GiftExchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GiftExchangeMembers" ADD CONSTRAINT "_GiftExchangeMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GiftExchangeAdmins" ADD CONSTRAINT "_GiftExchangeAdmins_A_fkey" FOREIGN KEY ("A") REFERENCES "GiftExchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GiftExchangeAdmins" ADD CONSTRAINT "_GiftExchangeAdmins_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
