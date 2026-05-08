/*
  Warnings:

  - You are about to drop the column `createdAt` on the `EmailOpen` table. All the data in the column will be lost.
  - Added the required column `emailSentId` to the `EmailOpen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailOpen" DROP COLUMN "createdAt",
ADD COLUMN     "browser" TEXT,
ADD COLUMN     "browserVersion" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "device" TEXT,
ADD COLUMN     "emailSentId" TEXT NOT NULL,
ADD COLUMN     "os" TEXT,
ADD COLUMN     "osVersion" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- CreateTable
CREATE TABLE "EmailBatch" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailSent" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "batchId" TEXT,

    CONSTRAINT "EmailSent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailSent_trackingId_key" ON "EmailSent"("trackingId");

-- AddForeignKey
ALTER TABLE "EmailSent" ADD CONSTRAINT "EmailSent_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "EmailBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailOpen" ADD CONSTRAINT "EmailOpen_emailSentId_fkey" FOREIGN KEY ("emailSentId") REFERENCES "EmailSent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
