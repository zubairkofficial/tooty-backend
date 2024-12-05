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

@Table({
    tableName: 'bots',
    timestamps: true,
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
        type: DataType.TEXT,
    })
    description: string;

    @Column({
        type: DataType.STRING,
    })
    ai_model: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
    })
    user_id: number;

    @BelongsTo(() => User)
    user!: User

    @BelongsToMany(() => File, () => Join_BotContextData)
    file!: File[];
}
