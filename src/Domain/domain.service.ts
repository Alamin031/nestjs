import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { domainDtoType } from './dto/domain.dto';

@Injectable()
export class DomainService {
  constructor(private prisma: PrismaService) {}

  async createDomain(data: domainDtoType): Promise<domainDtoType> {
    try {
      const domain = await this.prisma.domain.create({
        data: {
          name: data.name,
        },
      });

      return domain;
    } catch (error) {
      throw error;
    }
  }

  async listDomain(): Promise<domainDtoType[]> {
    try {
      const domain = await this.prisma.domain.findMany();
      return domain;
    } catch (error) {
      throw error;
    }
  }

  async listDomainById(id: number): Promise<domainDtoType> {
    try {
      const domain = await this.prisma.domain.findFirst({
        where: {
          id: id,
        },
      });
      return domain;
    } catch (error) {
      throw error;
    }
  }

  async updateDomainById(
    id: number,
    data: domainDtoType,
  ): Promise<domainDtoType> {
    try {
      const domain = await this.prisma.domain.update({
        where: {
          id: id,
        },
        data: {
          name: data.name,
        },
      });
      return domain;
    } catch (error) {
      throw error;
    }
  }

  async deleteDomainById(id: number): Promise<domainDtoType> {
    try {
      const domain = await this.prisma.domain.delete({
        where: {
          id: id,
        },
      });
      return domain;
    } catch (error) {
      throw error;
    }
  }
}
