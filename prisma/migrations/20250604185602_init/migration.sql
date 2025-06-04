/*
  Warnings:

  - Added the required column `compressedSize` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalSize` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "compressedSize" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "originalSize" TEXT NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
