import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFileDto {
    @IsString()
    file_name: string;

    @IsString()
    slug: string

}
