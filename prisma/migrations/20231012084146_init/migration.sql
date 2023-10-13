-- CreateTable
CREATE TABLE "Chatbot" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icone" TEXT,
    "files" TEXT[],
    "isGreetings" BOOLEAN NOT NULL DEFAULT false,
    "greetingsSMS" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chatbot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chatbot_name_key" ON "Chatbot"("name");
