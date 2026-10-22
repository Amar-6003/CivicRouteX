/*
  Warnings:

  - You are about to drop the column `isFallback` on the `Authority` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Authority` table. All the data in the column will be lost.
  - You are about to drop the column `serviceKeywords` on the `Authority` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Authority" DROP COLUMN "isFallback",
DROP COLUMN "priority",
DROP COLUMN "serviceKeywords",
ALTER COLUMN "jurisdictionType" DROP NOT NULL,
ALTER COLUMN "jurisdictionType" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Authority_verified_idx" ON "Authority"("verified");
