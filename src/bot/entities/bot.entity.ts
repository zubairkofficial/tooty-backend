import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';
import { Join_BotContextData } from './join_botContextData.entity';
import { File } from 'src/context_data/entities/file.entity';
import { Subject } from 'src/subject/entity/subject.entity';
import { Level } from 'src/level/entity/level.entity';

@Table({
    tableName: 'bots',
    timestamps: true,
    paranoid: true
})
export class Bot extends Model {
    @PrimaryKey
    @Column({
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    id: number;

    @Column({
        type: DataType.STRING,
    })
    name: string;

    @Column({
        type: DataType.STRING,
    })
    display_name: string;

    @Column({
        type: DataType.TEXT,
    })
    description: string;

    @Column({
        type: DataType.TEXT,
    })
    first_message: string;

    @Column({
        type: DataType.STRING
    })
    bot_image_url: string

    @Column({
        type: DataType.STRING,
    })
    ai_model: string;


    @Column({
        type: DataType.STRING,
    })
    voice_model: string;

    @Column({
        type: DataType.INTEGER,
    })
    level_id: number;

    @ForeignKey(() => Subject)
    @Column({
        type: DataType.INTEGER,
    })
    subject_id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
    })
    user_id: number;

    @BelongsTo(() => User, {
        onDelete: "CASCADE",
    })
    user!: User

    @BelongsToMany(() => File, () => Join_BotContextData)
    file!: File[];

    @BelongsTo(() => Subject)
    subject!: Subject
}
