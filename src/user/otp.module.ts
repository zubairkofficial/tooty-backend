// src/otp/otp.module.ts
import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { User } from './entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([User])], // Import OTP entity for DB interaction
  providers: [OtpService],
  controllers: [OtpController],
})
export class OtpModule {}
