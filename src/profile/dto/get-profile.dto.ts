import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetProfileDto {
    @IsNumber()
    user_id: number;
}


