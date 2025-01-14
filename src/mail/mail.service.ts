import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.PASS,
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP for Signup Verification',
      text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
