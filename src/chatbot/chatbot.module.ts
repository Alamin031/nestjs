import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { PrismaService } from 'src/prisma/prisma.service';
// import { multerOptions } from 'src/middleware/multer.config';
// import { MulterModule } from '@nestjs/platform-express';

@Module({
  // imports: [MulterModule.register(multerOptions)],
  controllers: [ChatbotController],
  providers: [ChatbotService, PrismaService],
})
export class ChatbotModule {}
