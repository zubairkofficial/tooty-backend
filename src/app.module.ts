import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { Otp } from './user/entities/otp.entity';
import dbConfig_DEVELOPMENT from './config/config.development';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig_DEVELOPMENT],
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      port: 5432,
      username: "postgres",
      password: "12345678",
      database: "tooty",
      autoLoadModels: true,
      models: [User, Otp],
      synchronize: true,
      retryDelay: 3000,
    }),

    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
