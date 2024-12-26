import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateSubjectDto {

    @IsString()
    @IsNotEmpty()
    title: string


    @IsString()
    @IsNotEmpty()
    display_title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsNumber()
    level_id: number


}

export class GetSubjectByLevelDto {
    @IsNumber()
    level_id: number
}

export class GetSubjectDto {
    @IsNumber()
    subject_id: number
}

export class UpdateSubjectDto {
    @IsNumber()
    id: number
    
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    display_title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsNumber()
    level_id: number

}