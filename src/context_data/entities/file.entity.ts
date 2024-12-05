import {
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';

import { Bot } from '../../bot/entities/bot.entity';
import { Join_BotContextData } from '../../bot/entities/join_botContextData.entity';
import { ContextData } from './contextData.entity';

@Table({
    tableName: 'file',
    timestamps: true,
})
export class File extends Model {
    @PrimaryKey
    @Column({
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    id: number;


    @Column({
        type: DataType.STRING,
    })
    file_name: string;

    @Unique
    @Column({
        type: DataType.STRING,
    })
    slug: string;

    @HasMany(() => ContextData)
    chunks: ContextData[]

    @BelongsToMany(() => Bot, () => Join_BotContextData)
    bots!: Bot[];
}
