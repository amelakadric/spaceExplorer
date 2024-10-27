import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PlanetPositionsService } from '../services/planet-positions.service';

@Controller('planet-positions')
export class PlanetPositionsController {
  constructor(
    private readonly planetPositionsService: PlanetPositionsService,
  ) {}

  @Get()
  async getPlanetPositions(@Query('date') date: string) {
    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }

    try {
      const data = await this.planetPositionsService.getPlanetPositions(date);
      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to get planetary positions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
