import { IsNotEmpty, isNumber, IsNumber, IsString } from "class-validator";

export class CreateBotDto {
    readonly id: number;
    @IsString({ message: 'name should be string' })
    @IsNotEmpty({ message: 'name should not be empty' })
    name: string;

    @IsString({ message: 'display_name should be string' })
    @IsNotEmpty({ message: 'display_name should not be empty' })
    display_name: string;

    @IsString({ message: 'name should be string' })
    @IsNotEmpty({ message: 'name should not be empty' })
    description: string;

    @IsString()
    @IsNotEmpty({ message: 'aimodel should not be empty' })
    ai_model: string;

    @IsString()
    @IsNotEmpty({ message: 'level should not be empty' })
    level: string;

    @IsNumber()
    file_id: number;

}

export class UpdateBotDto {

    @IsNumber()
    id: number

    @IsString({ message: 'name should be string' })
    @IsNotEmpty({ message: 'name should not be empty' })
    name: string;

    @IsString({ message: 'display_name should be string' })
    @IsNotEmpty({ message: 'display_name should not be empty' })
    display_name: string;

    @IsString({ message: 'name should be string' })
    @IsNotEmpty({ message: 'name should not be empty' })
    description: string;

    @IsString()
    @IsNotEmpty({ message: 'aimodel should not be empty' })
    ai_model: string;

    @IsString()
    @IsNotEmpty({ message: 'level should not be empty' })
    level: string;
}

export class DeleteBotDto {
    @IsNumber()
    bot_id: number

    @IsNumber()
    file_id: number

}

export class QueryBot {
    @IsString()
    @IsNotEmpty()
    query: string;


    @IsNumber()
    bot_id: number

}

export class GetBotDto {
    @IsNumber()
    bot_id: number
}