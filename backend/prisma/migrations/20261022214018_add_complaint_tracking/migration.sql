/*
  Warnings:

  - A unique constraint covering the columns `[trackingNumber]` on the table `Complaint` will be added. If there are existing duplicate values, this will fail.
  - The required column `trackingNumber` was added to the `Complaint` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "trackingNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_trackingNumber_key" ON "Complaint"("trackingNumber");
