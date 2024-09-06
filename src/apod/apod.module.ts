import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Apod, ApodSchema } from '../shared/database/schemas/apod.schema';
import { ApodController } from './controllers/apod.controller';
import { ApodService } from './services/apod.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: Apod.name, schema: ApodSchema }]),
    HttpModule,
  ],
  providers: [ApodService],
  controllers: [ApodController],
})
export class ApodModule {}
