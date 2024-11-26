// src/otp/otp.module.ts
import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])], // Import OTP entity for DB interaction
  providers: [OtpService],
  controllers: [OtpController],
})
export class OtpModule {}
