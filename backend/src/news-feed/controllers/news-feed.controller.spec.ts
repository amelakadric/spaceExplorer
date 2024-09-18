import { Test, TestingModule } from '@nestjs/testing';
import { NewsFeedController } from './news-feed.controller';

describe('NewsFeedController', () => {
  let controller: NewsFeedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsFeedController],
    }).compile();

    controller = module.get<NewsFeedController>(NewsFeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
