-- AlterTable
ALTER TABLE "Authority" ADD COLUMN     "level" TEXT;

-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "district" TEXT,
ADD COLUMN     "governmentLevel" TEXT,
ADD COLUMN     "routingReason" TEXT,
ADD COLUMN     "routingStatus" TEXT;

-- CreateTable
CREATE TABLE "LGDLocalBody" (
    "id" SERIAL NOT NULL,
    "lgdCode" INTEGER NOT NULL,
    "stateCode" INTEGER NOT NULL,
    "stateName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typeCode" TEXT,
    "typeName" TEXT,
    "entityCode" INTEGER,
    "entityName" TEXT,
    "entityType" TEXT,
    "coverageType" TEXT,
    "lastUpdated" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LGDLocalBody_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LGDLocalBody_lgdCode_key" ON "LGDLocalBody"("lgdCode");

-- CreateIndex
CREATE INDEX "LGDLocalBody_stateName_idx" ON "LGDLocalBody"("stateName");

-- CreateIndex
CREATE INDEX "LGDLocalBody_entityName_idx" ON "LGDLocalBody"("entityName");

-- CreateIndex
CREATE INDEX "LGDLocalBody_name_idx" ON "LGDLocalBody"("name");

-- CreateIndex
CREATE INDEX "LGDLocalBody_typeName_idx" ON "LGDLocalBody"("typeName");

-- CreateIndex
CREATE INDEX "Authority_level_idx" ON "Authority"("level");

-- CreateIndex
CREATE INDEX "Complaint_userId_idx" ON "Complaint"("userId");

-- CreateIndex
CREATE INDEX "Complaint_category_idx" ON "Complaint"("category");

-- CreateIndex
CREATE INDEX "Complaint_governmentLevel_idx" ON "Complaint"("governmentLevel");

-- CreateIndex
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");

-- CreateIndex
CREATE INDEX "Complaint_state_idx" ON "Complaint"("state");

-- CreateIndex
CREATE INDEX "Complaint_district_idx" ON "Complaint"("district");

-- CreateIndex
CREATE INDEX "Complaint_city_idx" ON "Complaint"("city");

-- CreateIndex
CREATE INDEX "Complaint_authorityId_idx" ON "Complaint"("authorityId");

-- CreateIndex
CREATE INDEX "Complaint_createdAt_idx" ON "Complaint"("createdAt");
