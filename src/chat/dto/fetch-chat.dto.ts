import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class FetchChatDto {

  @IsNumber()
  bot_id: number;

}



export class FetchChatHistoryDto {

  @IsNumber()
  user_id: number
  @IsNumber()
  bot_id: number;

}



