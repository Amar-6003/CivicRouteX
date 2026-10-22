/*
  Warnings:

  - A unique constraint covering the columns `[registryKey]` on the table `Authority` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Authority" ADD COLUMN     "registryKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Authority_registryKey_key" ON "Authority"("registryKey");
