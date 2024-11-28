import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  // User Signup
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  // User Login
  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    return this.userService.login(createUserDto);
  }

  @Post('send-otp')
  async send(@Body() sendOtpDto: SendOtpDto) {

    const otp = await this.userService.sendOtpToEmail(sendOtpDto);
    return { message: 'OTP sent successfully' }; // Optional: send OTP in response
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOptDto: VerifyOtpDto) {
    
    return this.userService.verifyOtp(verifyOptDto);
  }
}
