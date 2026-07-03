/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `credit_transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "credit_transactions_sessionId_key" ON "credit_transactions"("sessionId");
