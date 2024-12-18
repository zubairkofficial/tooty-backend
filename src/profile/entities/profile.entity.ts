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
import { User } from 'src/user/entities/user.entity';


@Table({
    tableName: 'profile',
    timestamps: true,
    paranoid: true
})
export class Profile extends Model {
    @PrimaryKey
    @Column({
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    id: number; //it must be equal to the id in User table

    @Column({
        type: DataType.STRING,
    })
    level: string;

    @Column({
        type: DataType.STRING,
    })
    user_roll_no: string;



    // @Column({
    //     type: DataType.STRING,
    // })
    // gender: string;

    // @Column({
    //     type: DataType.STRING,
    // })
    // institute: string;

    // @Column({
    //     type: DataType.STRING,
    // })
    // address: string;

    // @Column({
    //     type: DataType.DATE,
    // })
    // dob: Date;


    // @Unique
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    user_id: number;


    @BelongsTo(() => User)
    user!: User
}
