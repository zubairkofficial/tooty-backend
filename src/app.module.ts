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
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      models: [User, Otp],
      synchronize: process.env.DB_SYNCHRONIZE == "true" ? true : false,
      retryDelay: 3000,
    }),

    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
