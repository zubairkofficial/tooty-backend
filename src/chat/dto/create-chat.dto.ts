import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  bot_id: number;

  @IsString()
  image_url: string

  @IsString()
  message: string;

  // @IsNotEmpty()
  // is_bot: boolean;
}


