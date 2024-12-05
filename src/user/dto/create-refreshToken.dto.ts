import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateRefreshTokenDto {
  readonly id: number;

  @IsString({ message: 'name should be string' })
  @IsNotEmpty({ message: 'name should not be empty' })
  refresh_token: string;

  user_id: number;
}
