import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { JwtMiddleware } from './middlewares/jwtVerify.middleware';

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
      models: [User, Otp, RefreshToken, Bot, ContextData, Join_BotContextData, File],
      synchronize: process.env.DB_SYNCHRONIZE == 'true' ? true : false,

      sync: {
        force: process.env.NODE_ENV == 'development' ? false : false,
        alter: process.env.NODE_ENV == 'development' ? false : false,
      },
      retryDelay: 3000,
    }),

    UserModule,

    BotModule,

    ContextDataModule,

    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService
    //   , {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard
    // }
  ],
})
export class AppModule { }

// implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(JwtMiddleware)  // Apply JWT verification middleware
//       .forRoutes(
//         'user/logout', 'user/refresh-access-token', 'bot/create-bot', 'bot/delete-bot', 'bot/query-bot', 'bot/join-bot-context', 'context-data/upload', 'context-data/delete'

//       ); // Apply to specific routes or controllers, like 'profile' or '/profile/*'
//   }
// }
