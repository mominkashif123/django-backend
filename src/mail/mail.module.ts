import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService], // Register MailService
  exports: [MailService],   // Export MailService so other modules can use it
})
export class MailModule {}
