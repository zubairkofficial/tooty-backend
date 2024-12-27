import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateApiKeyDto {
    @IsString()
    @IsNotEmpty()
    api_key: string;



    @IsString()
    @IsNotEmpty()
    api_name: string;
}

export class GetVoiceModelDto {

    @IsString()
    @IsNotEmpty()
    model_id: string
}
