import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateStudentProfileDto {


    @IsNumber()
    level_id: number;

    @IsString({ message: 'level should be string' })
    @IsNotEmpty({ message: 'level should not be empty' })
    user_roll_no: string;
    // @IsString({ message: 'bio should be string' })
    // @IsNotEmpty({ message: 'bio should not be empty' })
    // bio: string;

    // @IsString({ message: 'profile pic should be string' })
    // @IsNotEmpty({ message: 'profile pic should not be empty' })
    // profile_pic: string;

    // @IsString({ message: 'gender should be string' })
    // @IsNotEmpty({ message: 'gender should not be empty' })
    // gender: string;

    // @IsString({ message: 'institute should be string' })
    // @IsNotEmpty({ message: 'institute should not be empty' })
    // institute: string;

    // @IsString({ message: 'address should be string' })
    // @IsNotEmpty({ message: 'address should not be empty' })
    // address: string;

    // @IsDate()
    // dob: Date;

    @IsNumber()
    user_id: number;
}


