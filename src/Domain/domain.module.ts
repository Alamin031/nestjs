import { Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [DomainService, PrismaService],
  controllers: [DomainController],
  exports: [DomainService],
})
export class DomainModule {}
