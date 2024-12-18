import {
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';
import { Bot } from './bot.entity';
import { File } from 'src/context_data/entities/file.entity';

@Table({
    tableName: 'Join_Bots_Files',
    timestamps: true,

})
export class Join_BotContextData extends Model {
    @PrimaryKey
    @Column({
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    id: number;

    @Unique
    @ForeignKey(() => Bot)
    @Column({
        type: DataType.INTEGER,
    })
    bot_id: number;

    @ForeignKey(() => File)
    @Column({
        type: DataType.INTEGER,
    })
    file_id: number;

}
