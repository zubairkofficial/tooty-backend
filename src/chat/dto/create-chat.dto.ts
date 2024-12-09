import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateChatDto {
 

  @IsNumber()
  bot_id: number;


  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  is_bot: boolean;
}


