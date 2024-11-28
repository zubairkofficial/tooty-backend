import * as path from 'path';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'dbconfig.dev',
  () => ({
    port: process.env.PORT || 3000,
    database: {
      dialect: process.env.DB_DIALECT || 'postgres',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '12345678',
      database: process.env.DB_NAME || 'tooty',
      synchronize: process.env.DB_SYNCHRONIZE === 'true' || true,
    },
    emailServer: {
      host: process.env.EMAIL_HOST || 'smtp.titan.email',
      port: parseInt(process.env.EMAIL_PORT, 10) || 587,
      username: process.env.EMAIL_USERNAME || 'info@martinmobiles.com',
      password: process.env.EMAIL_PASSWORD || 'Info@1234',
      encryption: process.env.EMAIL_ENCRYPTION || 'tls',
      fromAddress: process.env.EMAIL_FROM_ADDRESS || 'info@martinmobiles.com',
      fromName: process.env.EMAIL_FROM_NAME || 'Tooty',
      driver: process.env.EMAIL_DRIVER || 'smtp',
    }
  }),
);
