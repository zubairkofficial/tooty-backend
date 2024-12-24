import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetBotByLevelDto {

    @IsNumber()
    level_id: number

}
