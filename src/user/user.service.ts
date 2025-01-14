import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { MailService } from '../mail/mail.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  // Signup and send OTP
  async signup(email: string, password: string): Promise<any> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save user with OTP
    const user = new this.userModel({ email, password, otp });
    await user.save();

    // Send OTP to email
    await this.mailService.sendOtp(email, otp);

    return { message: 'OTP sent to your email. Please verify.' };
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string): Promise<any> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    await user.save();

    return { message: 'Account verified successfully!' };
  }

  // Login
  async login(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });

    if (!user || user.password !== password) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new BadRequestException('Account not verified. Please verify OTP.');
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      'your_jwt_secret', // Replace with a secure secret
      { expiresIn: '1h' },
    );

    return { token, message: 'Login successful' };
  }
}
