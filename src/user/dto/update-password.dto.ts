import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsEmail()
  @IsNotEmpty({ message: 'email should not be empty' })
  email: string;
  @IsString()
  @IsNotEmpty({ message: 'otp should not be empty' })
  otp: string;
  @IsString()
  @IsNotEmpty({ message: 'otp should not be empty' })
  password: string;
}
