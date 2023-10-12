import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { DomainService } from './domain.service';

@Controller('domain')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Post('create')
  async createDomain(@Body() data: any) {
    try {
      const domain = await this.domainService.createDomain(data);
      return {
        message: 'Domain create successfully',
        domain,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Get('list')
  async listDomain() {
    try {
      const domain = await this.domainService.listDomain();
      return {
        message: 'Domain list successfully',
        domain,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  //get list by id
  @Get('list/:id')
  async listDomainById(@Body() data: any) {
    try {
      const domain = await this.domainService.listDomainById(data);
      return {
        message: 'Domain list successfully',
        domain,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  //update list by id
  @Put('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updated_data: any,
  ): Promise<object> {
    return await this.domainService.updateDomainById(id, updated_data);
  }

  //delete by id
  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return await this.domainService.deleteDomainById(id);
  }
}
