import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBotContextDto {

    @IsNumber()
    bot_id: number;

    @IsNumber()
    file_id: number;


}

export class UpdateBotContextDto {

    @IsNumber()
    bot_id: number;

    @IsNumber()
    file_id: number;


}
export class GetBotContextDto {
    @IsNumber()
    bot_id: number;
}
