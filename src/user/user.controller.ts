import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  GetUserDto,
  RefreshAccessToken,
  UserLoginDto,
  UserLogoutDto,
} from './dto/create-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) { }


  //where role is user
  @Post('get-student')
  async getStudent(@Body() getStudentDto: GetUserDto, @Req() req: any) {
    return this.userService.getStudent(getStudentDto, req)
  }

  //where role is user
  @Get('get-all-students')
  async getAllUser(@Req() req: any) {
    return this.userService.getAllStudents(req)
  }

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
  @UseGuards(JwtAuthGuard)
  async logout(@Body() userLogoutDto: UserLogoutDto) {
    return this.userService.logout(userLogoutDto);
  }

  @Post('refresh-access-token')
  @UseGuards(JwtAuthGuard)
  async refreshAccessToken(@Body() refreshAccessToken: RefreshAccessToken) {
    return this.userService.refreshAccessToken(refreshAccessToken);
  }

  @Post('send-otp')
  async send(@Body() sendOtpDto: SendOtpDto) {
    return await this.userService.sendOtpToEmail(sendOtpDto);
  }

  @Post('update-password')
  @UseGuards(JwtAuthGuard)
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
