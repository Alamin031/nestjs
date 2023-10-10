-- CreateTable
CREATE TABLE "User1" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "otp" TEXT,
    "otpExpiresAt" TIMESTAMP(3),

    CONSTRAINT "User1_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User1_email_key" ON "User1"("email");
