import {
    BeforeCreate,
    BeforeUpdate,
    BelongsTo,
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
import { User } from 'src/user/entities/user.entity';
import { Subject } from 'src/subject/entity/subject.entity';
// import slugify from 'slugify';

@Table({
    tableName: 'file',
    timestamps: true,
    paranoid: true
})
export class File extends Model {
    @PrimaryKey
    @Column({
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
    })
    user_id: number;

    @ForeignKey(() => Subject)
    @Column({
        type: DataType.INTEGER,
    })
    subject_id: number;


    @Column({
        type: DataType.INTEGER,
    })
    processed: number;

    @Column({
        type: DataType.STRING,
    })
    file_name: string;

    @Unique
    @Column({
        type: DataType.STRING,
    })
    slug: string;


    // @BeforeCreate
    // @BeforeUpdate
    // static generateSlug(file: File) {
    //     file.slug = slugify(file.file_name, { lower: true, trim: true, strict: true });
    // }

    @HasMany(() => ContextData)
    chunks: ContextData[]

    @BelongsTo(() => User)
    user!: User;

    @BelongsTo(() => Subject)
    subject!: Subject;


    @BelongsToMany(() => Bot, () => Join_BotContextData)
    bots!: Bot[];
}
