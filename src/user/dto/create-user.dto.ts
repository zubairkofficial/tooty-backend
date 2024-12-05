import { IsEmail, IsNotEmpty, isString, IsString } from 'class-validator';
import { CreateRefreshTokenDto } from './create-refreshToken.dto';

export class CreateUserDto {
  readonly id: number;
  @IsString({ message: 'name should be string' })
  @IsNotEmpty({ message: 'name should not be empty' })
  name: string;
  @IsEmail()
  @IsNotEmpty({ message: 'email should not be empty' })
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  contact: string;
}

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'email should not be empty' })
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
export class UserLogoutDto {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}

export class RefreshAccessToken {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
