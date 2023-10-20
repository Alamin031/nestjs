import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './customer/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { DomainModule } from './Domain/domain.module';
import { AdminModule } from './admin/admin.modul';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AdminModule,
    UserModule,
    AuthModule,
    DomainModule,
    ChatbotModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ServeStaticModule.forRoot(
      // {
      //   rootPath: join(__dirname, '..', 'public/uploads/profile'),
      //   serveStaticOptions: { redirect: false, index: false },
      // },
      {
        rootPath: join(__dirname, '..', 'public'),
        serveStaticOptions: { redirect: false, index: false },
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, PrismaService],
})
export class AppModule {}
