import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  otp: string; // OTP for verification

  @Prop({ default: false })
  isVerified: boolean; // User verification status
}

export const UserSchema = SchemaFactory.createForClass(User);
