import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetStudentProfileDto {
    @IsNumber()
    user_id: number;
}


