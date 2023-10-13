-- CreateTable
CREATE TABLE "Chatbot1" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icone" TEXT,
    "isGreetings" BOOLEAN NOT NULL DEFAULT false,
    "greetingsSMS" TEXT,
    "files" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chatbot1_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chatbot1_name_key" ON "Chatbot1"("name");
