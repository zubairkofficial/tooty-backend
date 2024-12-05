import {
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { Bot } from './bot.entity';
import { File } from 'src/context_data/entities/file.entity';

@Table({
    tableName: 'context_data',
    timestamps: true,

})
export class Join_BotContextData extends Model {
    @PrimaryKey
    @Column({
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    id: number;

    @ForeignKey(() => Bot)

    @Column({
        type: DataType.INTEGER,
        onDelete: "CASCADE",
    })
    bot_id: number;

    @ForeignKey(() => File)
    @Column({
        type: DataType.INTEGER,
        onDelete: "CASCADE",
    })
    file_id: number;

}
