import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/controllers/users.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://amela00108:sMokbBTMU809p5J4@cluster0.kbsoc.mongodb.net/spaceExplorer',
    ),
    AuthModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
