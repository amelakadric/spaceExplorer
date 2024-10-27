import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { Apod } from '../../shared/database/schemas/apod.schema';

@Injectable()
export class ApodService {
  private readonly apiKey = process.env.APOD_API_KEY;
  private readonly apodUrl = process.env.APOD_API_URL;

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Apod.name) private readonly apodModel: Model<Apod>,
  ) {}

  @Cron('1 0 * * *') // Runs at 00:01 every day
  async fetchApodData(date?: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.apodUrl, {
          params: {
            api_key: this.apiKey,
            date: date ? date : new Date().toString(),
          },
        }),
      );

      const apodData = response.data;
      await this.apodModel.findOneAndUpdate({ date: apodData.date }, apodData, {
        upsert: true,
        new: true,
      });

      console.log('Fetched and stored APOD data for:', apodData.date);
    } catch (error) {
      console.error('Error fetching APOD data:', error);
    }
  }

  async getApodData(date: string) {
    const data = await this.apodModel.findOne({ date }).exec();
    if (!data) {
      await this.fetchApodData(date);
      return await this.apodModel.findOne({ date }).exec();
    }
    return data;
  }
}
