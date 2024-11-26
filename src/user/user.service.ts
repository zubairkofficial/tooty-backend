import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from './otp.service'; // Import OTP Service

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService, // Inject OTP Service
  ) {}

  // Signup method for user registration
  async signup(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    // Return response
    return {
      message: 'You have successfully registered.',
      statusCode: 201,
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

    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
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
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = await this.otpService.sendOtpToEmail(email);
    user.otp = otp; // Store OTP in DB for verification
    await this.userRepository.save(user);

    return { message: 'OTP sent to email.' };
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // OTP verified, update user status
    user.isVerified = true;
    user.otp = null; // Clear OTP after successful verification
    await this.userRepository.save(user);

    return { message: 'Email verified successfully.' };
  }
}
