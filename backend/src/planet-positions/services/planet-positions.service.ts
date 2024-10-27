import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PlanetPositionsService {
  async getPlanetPositions(date: string): Promise<any> {
    try {
      const response = await axios.get(process.env.ASTRONOMY_API_URL, {
        params: {
          longitude: -84.39733,
          latitude: 33.775867,
          elevation: 1,
          from_date: date,
          to_date: date,
          time: '01:42:38',
        },
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.ASTRONOMY_API_KEY}`)}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch planetary positions from the external API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
