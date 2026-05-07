/*
  Warnings:

  - You are about to drop the column `userAgent` on the `EmailOpen` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmailOpen" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trackingId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "openedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_EmailOpen" ("createdAt", "id", "ipAddress", "openedAt", "trackingId") SELECT "createdAt", "id", "ipAddress", "openedAt", "trackingId" FROM "EmailOpen";
DROP TABLE "EmailOpen";
ALTER TABLE "new_EmailOpen" RENAME TO "EmailOpen";
CREATE INDEX "EmailOpen_trackingId_idx" ON "EmailOpen"("trackingId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
