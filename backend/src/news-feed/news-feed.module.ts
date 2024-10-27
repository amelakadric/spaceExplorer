import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NewsFeedController } from './controllers/news-feed.controller';
import { NewsFeedService } from './services/news-feed.service';

@Module({
  imports: [HttpModule],
  controllers: [NewsFeedController],
  providers: [NewsFeedService],
})
export class NewsFeedModule {}
