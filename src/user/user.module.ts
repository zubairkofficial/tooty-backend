// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { OtpModule } from './otp.module';
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: 'yourSecretKey', 
      signOptions: { expiresIn: '1h' },
    }),
    OtpModule, // Add OTP Module
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
