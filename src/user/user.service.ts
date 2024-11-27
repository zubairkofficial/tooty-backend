import { BadRequestException, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User} from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from './otp.service'; // Import OTP Service

export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) { }

  // Signup method for user registration
  async signup(createUserDto: CreateUserDto) {

    const existingUser = await User.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new User();
    newUser.name = createUserDto.name;
    newUser.email = createUserDto.email;
    newUser.password = hashedPassword;
    newUser.save();
    return {
      message: 'You have successfully registered.',
      statusCode: HttpStatus.OK,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  }

  // Login method to validate user and generate JWT token
  async login(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful.',
      statusCode: 200,
      data: {
        accessToken: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    };
  }

  // Send OTP and store in DB
  async sendOtp(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = await this.otpService.sendOtpToEmail(email);
    user.otp = otp;
    await user.save();

    return { message: 'OTP sent to email.' };
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    user.isVerified = true;
    user.otp = null;
    user.save();

    return { message: 'Email verified successfully.' };
  }
}
