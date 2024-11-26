// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Users } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { OtpModule } from './otp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: 'yourSecretKey', // You should use an environment variable here
      signOptions: { expiresIn: '1h' },
    }),
    OtpModule, // Add OTP Module
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
