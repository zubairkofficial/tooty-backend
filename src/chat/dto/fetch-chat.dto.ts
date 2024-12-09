import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class FetchChatDto {
 
  @IsNumber()
  bot_id: number;

}


