import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { Otp } from './user/entities/otp.entity';
import { RefreshToken } from './user/entities/refreshToken.entity';
import { BotModule } from './bot/bot.module';
import { ContextDataModule } from './context_data/contextData.module';
import { Bot } from './bot/entities/bot.entity';
import { ContextData } from './context_data/entities/contextData.entity';
import { Join_BotContextData } from './bot/entities/join_botContextData.entity';
import { ApiModule } from './api/api.module';
import { File } from './context_data/entities/file.entity';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/entities/chat.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// import { UserProfileService } from './user-profile/user-profile.service';
// import { UserProfileController } from './user-profile/user-profile.controller';
// import { UserProfileModule } from './user-profile/user-profile.module';
// import { ProfileService } from './profile/profile.service';
import { StudentProfile } from './profile/entities/student-profile.entity';
import { API } from './api/entities/api.entity';
import { UserSeeder } from './seeds/user.seeder';
import { ProfileModule } from './profile/profile.module';
// import { ProfileModule } from './profile/profile.module';
import { SubjectModule } from './subject/subject.module';
import { LevelModule } from './level/level.module';
import { TeacherProfile } from './profile/entities/teacher-profile.entity';
import { Level } from './level/entity/level.entity';
import { Subject } from './subject/entity/subject.entity';
import { JoinTeacherSubjectLevel } from './profile/entities/join-teacher-subject-level.entity';
import { AdminProfile } from './profile/entities/admin-profile.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'), // Path to the static files
      serveRoot: '/static/images', // Serve files under the `/static` URL path (optional)
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      models: [User, Otp, RefreshToken, Bot, ContextData, Join_BotContextData, File, Chat, StudentProfile, TeacherProfile, AdminProfile, JoinTeacherSubjectLevel, Level, Subject, API],
      synchronize: process.env.DB_SYNCHRONIZE == 'true' ? true : false,

      sync: {
        force: process.env.NODE_ENV == 'development' ? false : false,
        alter: process.env.NODE_ENV == 'development' ? true : false,
      },
      retryDelay: 3000,
    }),

    UserModule,

    BotModule,

    ContextDataModule,

    ApiModule,

    ChatModule,

    ProfileModule,

    SubjectModule,

    LevelModule,

  ],
  controllers: [AppController],
  providers: [AppService,
    UserSeeder
    //  ProfileService
    //   , {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard
    // }
  ],
})
export class AppModule { }