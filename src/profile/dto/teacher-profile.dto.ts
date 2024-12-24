import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class UpdateTeacherProfileDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsNumber()
    user_id: number
}


export class GetTeacherProfileDto {
    @IsNumber()
    user_id: number;
}

export class CreateJoinTeacherSubjectLevel {

    @IsNumber()
    level_id: number

    @IsNumber()
    subject_id: number

    @IsNumber()
    teacher_id: number //it will be equal to user_id as id of teacher-profile is equal to user_id
}

export class DeleteJoinTeacherSubjectLevel {

    @IsNumber()
    level_id: number

    @IsNumber()
    subject_id: number

    @IsNumber()
    teacher_id: number //it will be equal to user_id as id of teacher-profile is equal to user_ids
}

