import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateLevelDto {

    @IsString()
    @IsNotEmpty()
    level: string

    @IsString()
    @IsNotEmpty()
    description: string
}


export class GetLevelDto {
    @IsNumber()
    level_id: number
}

export class UpdateLevelDto {
    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    level: string
}