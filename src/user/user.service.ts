import { BadRequestException, UnauthorizedException, HttpStatus, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SendOtpDto } from './dto/send-otp.dto';
import * as nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import { Otp } from './entities/otp.entity';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ConfigService } from '@nestjs/config';



export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly logger = new Logger("UserService"),


  ) {


  }

  private generateOtp(): string {
    const otp = randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    return otp;
  }

  async sendOtpToEmail(sendOtpDto: SendOtpDto) {
    const otp = this.generateOtp();

    try {
      // Check if an OTP already exists for the email
      const existingOtp = await Otp.findOne({ where: { email: sendOtpDto.email } });

      if (existingOtp) {
        // Update the existing record
        existingOtp.otp = otp;
        existingOtp.isVerified = false;
        existingOtp.updatedAt = new Date();
        await existingOtp.save();
      } else {
        // Create a new OTP record
        const otpRecord = new Otp();
        otpRecord.otp = otp;
        otpRecord.email = sendOtpDto.email;
        otpRecord.isVerified = false;
        await otpRecord.save();
      }

      this.logger.log(`The OTP is ${otp}, ${sendOtpDto.email}, ${process.env.EMAIL_HOST} `);

      const transporter = nodemailer.createTransport({

        host: `${process.env.EMAIL_HOST}`,
        port: Number(`${process.env.EMAIL_PORT}`),
        secure: false,
        auth: {
          user: `${process.env.EMAIL_USERNAME}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
      });

      // Send email
      await transporter.sendMail({
        from: `${process.env.EMAIL_FROM_ADDRESS}`,
        to: sendOtpDto.email, // Use the provided email
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}`,
        html: `<p>Your OTP is <strong>${otp}</strong></p>`,
      });

      return { message: 'OTP sent successfully', otp };

    } catch (error) {
      this.logger.error('Error sending OTP', error);
      throw new Error('Failed to send OTP');
    }
  }


  async verifyOtp(verifyOtp: VerifyOtpDto) {
    const otpRecord = await Otp.findOne({
      where: {
        otp: verifyOtp.otp,
        email: verifyOtp.email
      }
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
    }
  }
}
