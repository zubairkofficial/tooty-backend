import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateUserDto {

    @IsNumber()
    id: number;

    @IsString({ message: 'name should be string' })
    @IsNotEmpty({ message: 'name should not be empty' })
    name: string;

    @IsEmail()
    @IsNotEmpty({ message: 'email should not be empty' })
    email: string;

    @IsString()
    @IsNotEmpty()
    contact: string;

    @IsBoolean()
    isVerified: boolean

}