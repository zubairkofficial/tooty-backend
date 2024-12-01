import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { Otp } from './user/entities/otp.entity';
import { RefreshToken } from './user/entities/refreshToken.entity';

@Module({
  imports: [
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
      models: [User, Otp, RefreshToken],
      synchronize: process.env.DB_SYNCHRONIZE == 'true' ? true : false,
      dialectOptions: {
        alert: process.env.NODE_ENV == 'development' ? false : false,
      },
      sync: {
        force: process.env.NODE_ENV == 'development' ? false : false,
      },
      retryDelay: 3000,
    }),

    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
