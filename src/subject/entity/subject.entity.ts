import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    HasOne,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';
import { Bot } from 'src/bot/entities/bot.entity';
import { File } from 'src/context_data/entities/file.entity';
import { Level } from 'src/level/entity/level.entity';


@Table({
    tableName: 'subjects',
    timestamps: true,
    paranoid: true
})
export class Subject extends Model {
    @PrimaryKey
    @Column({
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    id: number;

    @Unique
    @Column({
        type: DataType.STRING
    })
    title: string

    @Column({
        type: DataType.STRING
    })
    display_title: string

    @Column({
        type: DataType.TEXT
    })
    description: string

    @ForeignKey(() => Level)
    @Column({
        type: DataType.INTEGER
    })
    level_id: number

    @HasMany(() => File)
    files!: File[]

    @BelongsTo(() => Level)
    level!: Level


    @HasOne(() => Bot)
    bot!: Bot
}
