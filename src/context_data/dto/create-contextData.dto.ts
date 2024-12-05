import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFileDto {
    @IsString()
    @IsNotEmpty()
    file_name: string;

    @IsString()
    @IsNotEmpty()
    slug: string

}


export class DeleteFileDto {
    @IsNumber()
    id: string;

}
