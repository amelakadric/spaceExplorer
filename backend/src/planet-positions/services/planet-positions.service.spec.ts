import { Test, TestingModule } from '@nestjs/testing';
import { PlanetPositionsService } from './planet-positions.service';

describe('PlanetPositionsService', () => {
  let service: PlanetPositionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanetPositionsService],
    }).compile();

    service = module.get<PlanetPositionsService>(PlanetPositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
