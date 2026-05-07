-- CreateTable
CREATE TABLE "EmailOpen" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailOpen_pkey" PRIMARY KEY ("id")
);
