-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "todo" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
