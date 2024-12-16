import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateApiKeyDto {
    @IsString()
    @IsNotEmpty()
    api_key: string;

    @IsNumber()
    id: string;
}
