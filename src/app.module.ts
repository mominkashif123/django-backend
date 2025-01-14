import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { MailService } from './mail/mail.service';
import { VideoModule } from './video/video.module';
import * as dotenv from 'dotenv';
dotenv.config();


@Module({
  imports: [
    // Connect to MongoDB with the connection string from the environment
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    VideoModule,
  ],
  providers: [MailService],
})
export class AppModule {}
