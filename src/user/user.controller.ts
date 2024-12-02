import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  RefreshAccessToken,
  UserLoginDto,
  UserLogoutDto,
} from './dto/create-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

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
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.userService.login(userLoginDto);
  }
  @Post('logout')
  async logout(@Body() userLogoutDto: UserLogoutDto) {
    return this.userService.logout(userLogoutDto);
  }

  @Post('refresh-access-token')
  async refreshAccessToken(@Body() refreshAccessToken: RefreshAccessToken) {
    return this.userService.refreshAccessToken(refreshAccessToken);
  }

  @Post('send-otp')
  async send(@Body() sendOtpDto: SendOtpDto) {
    return await this.userService.sendOtpToEmail(sendOtpDto);
  }

  @Post('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return await this.userService.updatePassword(updatePasswordDto);
  }

  @Post('verify-user')
  async verifyUser(@Body() verifyOptDto: VerifyOtpDto) {
    return this.userService.verifyUser(verifyOptDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOptDto: VerifyOtpDto) {
    return this.userService.verifyOtp(verifyOptDto);
  }
}
