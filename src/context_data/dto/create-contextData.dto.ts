import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFileDto {
    @IsString()
    @IsNotEmpty()
    file_name: string;

    @IsString()
    @IsNotEmpty()
    slug: string


    @IsString()
    @IsNotEmpty()
    subject_id: string

}


export class DeleteFileDto {
    @IsNumber()
    id: number;

}

export class GetFilesBySubjectDto {
    @IsNumber()
    subject_id: number;

}
