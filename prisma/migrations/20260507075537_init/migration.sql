-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmailOpen" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ipAddress" TEXT,
    "openedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_EmailOpen" ("createdAt", "id", "ipAddress", "openedAt") SELECT "createdAt", "id", "ipAddress", "openedAt" FROM "EmailOpen";
DROP TABLE "EmailOpen";
ALTER TABLE "new_EmailOpen" RENAME TO "EmailOpen";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
