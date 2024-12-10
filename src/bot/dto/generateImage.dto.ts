import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class GenerateImageDto {


    @IsString()
    @IsNotEmpty()
    answer: string


}
