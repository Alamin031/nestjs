import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  HttpException,
  HttpStatus,
  UploadedFiles,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ChatbotService } from './chatbot.service';
import { ChatbotDto1, chatbotDto } from 'src/customer/dto/customer.dto';
import { multerOptions } from 'src/middleware/multer.config';
import * as fs from 'fs';

@Controller('chatbot')
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Post('create')
  // @UseInterceptors(FileInterceptor('icone'))
  @UseInterceptors(FileInterceptor('icone', multerOptions('icone')))
  async createChatbot(
    @UploadedFile() icone: Express.Multer.File,
    @Body() chatbotData: chatbotDto,
  ) {
    try {
      const createdChatbot = await this.chatbotService.createChatbot(
        icone,
        chatbotData,
      );
      return createdChatbot;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Chatbot creation failed',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @Post('create1')
  @UseInterceptors(
    // FileInterceptor('icone', multerOptions('icone')),
    // FilesInterceptor('files', 10, multerOptions('files')),
    AnyFilesInterceptor(multerOptions('files')),
  )
  async createChatbot1(
    @UploadedFiles() files: any,
    @Body() chatbotData: ChatbotDto1,
  ) {
    try {
      const createdChatbot = await this.chatbotService.createChatbot1(
        files,
        chatbotData,
      );
      return createdChatbot;
    } catch (error) {
      // fs.unlinkSync(files[0].path);
      console.log(error);

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Chatbot creation failed',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
