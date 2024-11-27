// src/otp/otp.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { randomInt } from 'crypto';
import { Otp } from './entities/otp.entity';

// Load environment variables from .env file
dotenv.config();

@Injectable()
export class OtpService {
  private readonly emailTransporter;

  constructor() {
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private generateOtp(): string {
    const otp = randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    return otp;
  }

  async sendOtpToEmail(email: string) {
    const otp = this.generateOtp();

    const otpRecord = new Otp();
    otpRecord.otp = otp;
    otpRecord.email = email;
    otpRecord.isVerified = false;
    otpRecord.save();
    try {
      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}`,
        html: `<p>Your OTP is <strong>${otp}</strong></p>`,
      });
      return otp;
    } catch (error) {
      console.error('Error sending OTP via email', error);
      throw new Error('Failed to send OTP via email');
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const otpRecord = await Otp.findOne({
      where: { email, otp, isVerified: false },
    });

    if (!otpRecord) {
      throw new Error('Invalid or expired OTP');
    }
    const otpExpiry = new Date(otpRecord.createdAt);
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
    if (new Date() > otpExpiry) {
      throw new Error('OTP has expired');
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    return true;
  }
}
