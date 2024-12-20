import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, isString, IsString } from 'class-validator';
import { CreateRefreshTokenDto } from './create-refreshToken.dto';
import { Role } from 'src/utils/roles.enum';

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

export class CreateUserByAdminDto {

  @IsString({ message: 'name should be string' })
  @IsNotEmpty({ message: 'name should not be empty' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email should not be empty' })
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsString()
  @IsNotEmpty()
  role: Role;

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

export class GetUserDto {
  @IsNumber()
  user_id: number
}


export class RefreshAccessToken {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
