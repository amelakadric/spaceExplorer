import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ApodModule } from './apod/apod.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      'mongodb+srv://amela00108:sMokbBTMU809p5J4@cluster0.kbsoc.mongodb.net/spaceExplorer',
    ),
    AuthModule,
    UsersModule,
    ApodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
