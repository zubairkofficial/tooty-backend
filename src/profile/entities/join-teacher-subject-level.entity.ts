import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { TeacherProfile } from './teacher-profile.entity';


@Table({
    tableName: 'join-teacher-subject-level',
    timestamps: true,
    paranoid: true
})
export class JoinTeacherSubjectLevel extends Model {
    @PrimaryKey
    @Column({
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    id: number; //it must be equal to the id in User table

    @Column({
        type: DataType.INTEGER,
    })
    level_id: number;

    @Column({
        type: DataType.INTEGER,
    })
    subject_id: number;


    @ForeignKey(() => TeacherProfile)
    @Column({
        type: DataType.INTEGER
    })
    teacher_id: number // it will be the same as user id


    @BelongsTo(() => TeacherProfile)
    teacher!: TeacherProfile


}
