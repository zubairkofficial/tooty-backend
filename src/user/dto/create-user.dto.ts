import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    readonly id: number;
    @IsString({ message: "name should be string" })
    @IsNotEmpty({ message: "name should not be empty" })
    name: string;
    @IsEmail()
    @IsNotEmpty({ message: "email should not be empty" })
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
    @IsString()
    @IsNotEmpty()
    contact: string;

}

export class UserLoginDto {
    @IsEmail()
    @IsNotEmpty({ message: "email should not be empty" })
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
}