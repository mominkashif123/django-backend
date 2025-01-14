import { Controller, Get } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
dotenv.config();


@Controller('videos')
export class VideoController {
  private s3: AWS.S3;
  private bucketName = process.env.BUCKET;

  constructor() {
    this.s3 = new AWS.S3({
      region: process.env.REGION, 
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
    });
  }

  @Get()
  async getVideos() {
    const params = { 
      Bucket: this.bucketName,
    };

    try {
      const data = await this.s3.listObjectsV2(params).promise();
      console.log('S3 List Objects Response:', data); // Debugging log

      const videoUrls = data.Contents?.filter((item) => item.Key?.endsWith('.mp4')).map((item) =>
        this.s3.getSignedUrl('getObject', {
          Bucket: this.bucketName,
          Key: item.Key,
          Expires: 60 * 60, // URL expiration time (1 hour)
        }),
      );

      console.log('Generated Video URLs:', videoUrls); // Debugging log
      return { videos: videoUrls || [] };
    } catch (error) {
      console.error('Error fetching videos from S3:', error);
      throw error;
    }
  }
}
