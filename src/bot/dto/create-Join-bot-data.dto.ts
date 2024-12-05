import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateBotContextDto {
    readonly id: number;

    @IsInt({ message: 'bot_id should be INTEGER' })
    bot_id: number;

    @IsInt({ message: 'context-data_id should be INTEGER' })

    context_data_id: Array<number>;


}
