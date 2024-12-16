import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from './entities/profile.entity';
import { ConfigModule } from '@nestjs/config';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [SequelizeModule.forFeature([Profile]), ConfigModule],
    controllers: [ProfileController],
    providers: [ProfileService, JwtService]
})
export class ProfileModule { }
