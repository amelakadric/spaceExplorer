// rss-feed.controller.ts
import { Controller, Get } from '@nestjs/common';
import { NewsFeedService } from '../services/news-feed.service';

@Controller('news-feed')
export class NewsFeedController {
  constructor(private readonly newsFeedService: NewsFeedService) {}

  @Get()
  async getNasaFeed() {
    return await this.newsFeedService.getNasaNewsFeed();
  }
}
