/*
  Warnings:

  - You are about to drop the column `avata` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "avata",
ADD COLUMN     "avatar" TEXT;
