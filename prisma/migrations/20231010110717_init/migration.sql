/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `PasswordReset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset"("token");
