-- AlterTable
ALTER TABLE "Authority" ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'India',
ADD COLUMN     "jurisdictionType" TEXT NOT NULL DEFAULT 'LOCAL',
ALTER COLUMN "state" DROP NOT NULL;
