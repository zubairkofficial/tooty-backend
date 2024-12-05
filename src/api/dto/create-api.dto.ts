import { IsNotEmpty, IsString } from "class-validator";

export class AddAPIkeyDto {
    readonly id: number;
    @IsString({ message: 'name should be string' })
    @IsNotEmpty({ message: 'name should not be empty' })
    api_key: string;
}
