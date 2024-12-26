import { IsNotEmpty, isNumber, IsNumber, IsString } from "class-validator";

export class CreateBotDto {

    @IsString({ message: 'name should be string' })
    @IsNotEmpty({ message: 'name should not be empty' })
    name: string;

    @IsString({ message: 'display_name should be string' })
    @IsNotEmpty({ message: 'display_name should not be empty' })
    display_name: string;

    @IsString({ message: 'descroiption should be string' })
    @IsNotEmpty({ message: 'description should not be empty' })
    description: string;


    // @IsString({ message: 'first message should be string' })
    // @IsNotEmpty({ message: 'first_message should not be empty' })
    // first_message: string;

    @IsString()
    @IsNotEmpty({ message: 'aimodel should not be empty' })
    ai_model: string;

    @IsString()
    @IsNotEmpty()
    level_id: number;


    @IsString()
    @IsNotEmpty()
    subject_id: number;


    @IsString()
    @IsNotEmpty()
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

    @IsString({ message: 'description should be string' })
    @IsNotEmpty({ message: 'desciption should not be empty' })
    description: string;

    // @IsString({ message: 'first message should be string' })
    // @IsNotEmpty({ message: 'first_message should not be empty' })
    // first_message: string;

    @IsString()
    @IsNotEmpty({ message: 'aimodel should not be empty' })
    ai_model: string;

    @IsNumber()
    level_id: number;

    @IsNumber()
    subject_id: number
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

export class GetBotByLevelSubject {
    @IsNumber()
    subject_id: number;

    @IsNumber()
    level_id: number

}
export class GetBotDto {
    @IsNumber()
    bot_id: number
}