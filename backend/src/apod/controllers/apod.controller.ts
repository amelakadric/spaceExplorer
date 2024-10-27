import { Controller, Get, Query } from '@nestjs/common';
import { ApodService } from '../services/apod.service';

@Controller('apod')
export class ApodController {
  constructor(private readonly apodService: ApodService) {}

  @Get()
  async getApodData(@Query('date') date: string) {
    if (!date) {
      const today = new Date().toISOString().split('T')[0];
      date = today;
    }
    return this.apodService.getApodData(date);
  }
}
