import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBotDto {
    readonly id: number;
    @IsString({ message: 'name should be string' })
    @IsNotEmpty({ message: 'name should not be empty' })
    name: string;

    @IsString({ message: 'name should be string' })
    @IsNotEmpty({ message: 'name should not be empty' })
    description: string;

    @IsString()
    @IsNotEmpty({ message: 'email should not be empty' })
    ai_model: string;
}


export class DeleteBotDto {
    readonly id: number;

}

export class QueryBot {
    @IsString()
    @IsNotEmpty()
    query: string;

    @IsNumber()
    bot_id: number

}