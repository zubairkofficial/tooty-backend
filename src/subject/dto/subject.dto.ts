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


}


export class GetSubjectDto {
    @IsNumber()
    subject_id: number
}

export class UpdateSubjectDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    display_title: string

    @IsString()
    @IsNotEmpty()
    description: string
}