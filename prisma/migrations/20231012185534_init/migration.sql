/*
  Warnings:

  - You are about to drop the column `files` on the `Chatbot1` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chatbot1" DROP COLUMN "files";

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "chatbotId" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "Chatbot1"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
