import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';
import { Level } from 'src/level/entity/level.entity';
import { User } from 'src/user/entities/user.entity';


@Table({
    tableName: 'teacher-profile',
    timestamps: true,
    paranoid: true
})
export class TeacherProfile extends Model {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
    })
    id: number; //it must be equal to the id in User table

    @Column({
        type: DataType.STRING
    })
    title: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    user_id: number;


    @ForeignKey(() => Level)
    @Column({
        type: DataType.INTEGER
    })
    level_id: number;

    @BelongsTo(() => User)
    user!: User
}
