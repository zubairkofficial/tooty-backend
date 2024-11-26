// src/otp/otp.controller.ts
import { Controller, Post, Body, Query } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('auth')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  // Send OTP to the user's email
  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    const otp = await this.otpService.sendOtpToEmail(email);
    return { message: 'OTP sent successfully', otp }; // Optional: send OTP in response
  }

  // Verify the OTP entered by the user
  @Post('verify-otp')
  async verifyOtp(
    @Body() body: { email: string; otp: string },
  ) {
    const { email, otp } = body;
    const isVerified = await this.otpService.verifyOtp(email, otp);
    return { message: isVerified ? 'OTP verified successfully' : 'Invalid OTP' };
  }
}
