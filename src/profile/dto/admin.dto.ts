import { IsNotEmpty, IsString } from "class-validator";


export class UpdateAdminDto {

    @IsString()
    @IsNotEmpty()
    openai: string

    
    @IsString()
    @IsNotEmpty()
    dalle: string
    
    @IsString()
    @IsNotEmpty()
    deepgram: string

    @IsString()
    @IsNotEmpty()
    master_prompt: string

}
