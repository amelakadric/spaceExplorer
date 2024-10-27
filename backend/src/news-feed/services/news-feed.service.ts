import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as Parser from 'rss-parser';

@Injectable()
export class NewsFeedService {
  private parser: Parser;

  constructor(private httpService: HttpService) {
    this.parser = new Parser();
  }

  async getNasaNewsFeed() {
    const url = 'https://www.nasa.gov/news-release/feed/';
    try {
      const feed = await this.parser.parseURL(url);
      return feed.items.map((item) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        content: item.contentSnippet,
      }));
    } catch (error) {
      throw new Error('Failed to fetch RSS feed');
    }
  }
}
