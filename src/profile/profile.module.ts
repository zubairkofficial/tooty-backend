import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentProfile } from './entities/student-profile.entity';
import { ConfigModule } from '@nestjs/config';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JwtService } from '@nestjs/jwt';
import { TeacherProfile } from './entities/teacher-profile.entity';
import { JoinTeacherSubjectLevel } from './entities/join-teacher-subject-level.entity';
import { AdminProfile } from './entities/admin-profile.entity';

@Module({
    imports: [SequelizeModule.forFeature([StudentProfile, TeacherProfile, AdminProfile, JoinTeacherSubjectLevel]), ConfigModule],
    controllers: [ProfileController],
    providers: [ProfileService, JwtService]
})
export class ProfileModule { }
