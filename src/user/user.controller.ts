import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  // Send OTP to user's email
  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    return this.userService.sendOtp(email);
  }

  // Verify OTP
  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string, otp: string }) {
    return this.userService.verifyOtp(body.email, body.otp);
  }
}
