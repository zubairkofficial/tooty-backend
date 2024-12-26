import { IsNumber } from "class-validator";



export class GetStudentsByLevelDto {

    @IsNumber()
    level_id: number
}