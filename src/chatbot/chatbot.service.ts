import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatbotDto1, chatbotDto } from 'src/customer/dto/customer.dto';
import * as fs from 'fs';

@Injectable()
export class ChatbotService {
  constructor(private prisma: PrismaService) {}

  async createChatbot(icone: Express.Multer.File, chatbotData: chatbotDto) {
    try {
      const createdChatbot = await this.prisma.chatbot.create({
        data: {
          name: chatbotData.name,
          icone: `${icone.filename}`,
          greetingsSMS: chatbotData.greetingsSMS,
        },
      });

      return createdChatbot;
    } catch (error) {
      throw new BadRequestException('Unable to create the chatbot');
    }
  }

  //   async createChatbot1(
  //     files: Express.Multer.File[],
  //     createChatbotDto: ChatbotDto1,
  //   ) {
  //     const { name, greetingsSMS } = createChatbotDto;
  //     let icone = files.find((file) => file.fieldname === 'icone');
  //     const files1 = files.filter((file) => file.fieldname !== 'icone');
  //     if (!icone) {
  //       icone = null;
  //     }
  //     const createdChatbot = await this.prisma.chatbot1.create({
  //       data: {
  //         name,
  //         icone: icone.filename,
  //         greetingsSMS,
  //         files: {
  //           create: files1.map((file) => ({ path: file.filename })),
  //         },
  //       },
  //       include: {
  //         files: true, // Include the associated files in the response
  //       },
  //     });

  //     return createdChatbot;
  //   }
  // }
  async createChatbot1(
    files: Express.Multer.File[],
    createChatbotDto: ChatbotDto1,
  ) {
    const { name, greetingsSMS } = createChatbotDto;
    let icone = files.find((file) => file.fieldname === 'icone');
    const files1 = files.filter((file) => file.fieldname !== 'icone');
    if (!icone) {
      icone = null;
    }

    try {
      const createdChatbot = await this.prisma.chatbot1.create({
        data: {
          name,
          icone: icone.filename,
          greetingsSMS,
          files: {
            create: files1.map((file) => ({ path: file.filename })),
          },
        },
        include: {
          files: true,
        },
      });

      return createdChatbot;
    } catch (error) {
      console.error(error);
      // Delete all files
      files.forEach((file) => {
        console.log(file);
        const filePath = file.path;
        console.log(filePath);
        fs.unlinkSync(filePath);
      });
      // Delete associated icone
      // icone && fs.unlinkSync(`./uploads/icone/${icone.filename}`);
      throw error;
    }
  }
}
