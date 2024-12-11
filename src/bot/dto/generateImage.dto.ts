import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GenerateImageDto {

    @IsNumber()
    chat_id: number

    @IsString()
    @IsNotEmpty()
    answer: string

    @IsNumber()
    bot_id: number


}
