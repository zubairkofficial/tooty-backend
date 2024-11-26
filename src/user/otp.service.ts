// src/otp/otp.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { Otp } from './entities/otp.entity';

// Load environment variables from .env file
dotenv.config();

@Injectable()
export class OtpService {
  private readonly emailTransporter;

  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>, // Inject OTP repository
  ) {
    // Initialize Nodemailer transporter for email
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Generate OTP (6 digits, numeric only)
  private generateOtp(): string {
    const otp = randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    return otp;
  }

  // Send OTP to email and store in DB
  async sendOtpToEmail(email: string): Promise<string> {
    const otp = this.generateOtp();

    // Store OTP in the database with the email
    const otpRecord = this.otpRepository.create({
      email,
      otp,
      createdAt: new Date(),
      isVerified: false,
    });
    await this.otpRepository.save(otpRecord);

    // Send OTP via email
    try {
      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}`,
        html: `<p>Your OTP is <strong>${otp}</strong></p>`,
      });
      return otp; // Return OTP for further use
    } catch (error) {
      console.error('Error sending OTP via email', error);
      throw new Error('Failed to send OTP via email');
    }
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    // Retrieve OTP from database based on email
    const otpRecord = await this.otpRepository.findOne({
      where: { email, otp, isVerified: false },
    });

    if (!otpRecord) {
      throw new Error('Invalid or expired OTP');
    }

    // Check if OTP has expired (set expiry duration as 5 minutes for example)
    const otpExpiry = new Date(otpRecord.createdAt);
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
    if (new Date() > otpExpiry) {
      throw new Error('OTP has expired');
    }

    // Mark OTP as verified
    otpRecord.isVerified = true;
    await this.otpRepository.save(otpRecord);

    return true; // OTP is verified
  }
}
