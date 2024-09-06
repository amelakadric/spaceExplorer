import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../shared/database/entities/user.entity';
import { UsersRepository } from '../shared/database/repostitories/users.repository';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersRepository, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
