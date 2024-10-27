import { Test, TestingModule } from '@nestjs/testing';
import { PlanetPositionsController } from './planet-positions.controller';

describe('PlanetPositionsController', () => {
  let controller: PlanetPositionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanetPositionsController],
    }).compile();

    controller = module.get<PlanetPositionsController>(
      PlanetPositionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
