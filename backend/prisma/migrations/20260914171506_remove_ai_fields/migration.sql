/*
  Warnings:

  - You are about to drop the column `aiSuggestion` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `aiSummary` on the `Complaint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "aiSuggestion",
DROP COLUMN "aiSummary";
