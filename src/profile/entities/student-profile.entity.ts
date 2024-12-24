import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasOne,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';
import { Level } from 'src/level/entity/level.entity';
import { User } from 'src/user/entities/user.entity';


@Table({
    tableName: 'student-profile',
    timestamps: true,
    paranoid: true
})
export class StudentProfile extends Model {
    @PrimaryKey
    @Column({
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    id: number; 


    @Column({
        type: DataType.STRING,
    })
    user_roll_no: string;


    @ForeignKey(() => Level)
    @Column({
        type: DataType.INTEGER,
    })
    level_id: number;


    @HasOne(() => Level)
    level!: Level


    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    user_id: number;


    @BelongsTo(() => User)
    user!: User
}
