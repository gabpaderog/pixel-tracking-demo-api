/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `EmailOpen` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmailOpen" DROP COLUMN "ipAddress",
ADD COLUMN     "clientIp" TEXT,
ADD COLUMN     "publicIp" TEXT;
