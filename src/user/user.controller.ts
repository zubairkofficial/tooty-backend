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
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/guards/roles.guard';

import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) { }


  //where role is user
  @Post('get-student')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getStudent(@Body() getStudentDto: GetUserDto, @Req() req: any) {
    return this.userService.getStudent(getStudentDto, req)
  }

  //where role is user
  @Get('get-all-students')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async logout(@Body() userLogoutDto: UserLogoutDto) {
    return this.userService.logout(userLogoutDto);
  }

  @Post('refresh-access-token')
  // @Roles(Role.USER)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async refreshAccessToken(@Body() refreshAccessToken: RefreshAccessToken) {
    return this.userService.refreshAccessToken(refreshAccessToken);
  }

  @Post('send-otp')
  async send(@Body() sendOtpDto: SendOtpDto) {
    return await this.userService.sendOtpToEmail(sendOtpDto);
  }

  @Post('update-user')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    return await this.userService.updateUser(updateUserDto, req);
  }

  @Post('update-password')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Req() req: any) {
    return await this.userService.updatePassword(updatePasswordDto, req);
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
