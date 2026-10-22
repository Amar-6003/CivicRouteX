-- AlterTable
ALTER TABLE "Authority" ADD COLUMN     "isFallback" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "serviceKeywords" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Authority_category_idx" ON "Authority"("category");

-- CreateIndex
CREATE INDEX "Authority_state_idx" ON "Authority"("state");

-- CreateIndex
CREATE INDEX "Authority_district_idx" ON "Authority"("district");

-- CreateIndex
CREATE INDEX "Authority_city_idx" ON "Authority"("city");
