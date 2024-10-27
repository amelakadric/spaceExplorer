import { Module } from '@nestjs/common';
import { PlanetPositionsController } from './controllers/planet-positions.controller';
import { PlanetPositionsService } from './services/planet-positions.service';

@Module({
  controllers: [PlanetPositionsController],
  providers: [PlanetPositionsService],
})
export class PlanetPositionsModule {}
