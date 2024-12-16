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
    tableName: 'apis',
    timestamps: true,
})
export class API extends Model {
    @PrimaryKey
    @Column({
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    id: number;

    @Column({
        type: DataType.STRING,
    })
    api_key: string;


    //to make the name of api key unique in the DB, we will join the api key name from user with the user_id
    @Unique
    @Column({
        type: DataType.STRING,
    })
    api_name: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
    })
    user_id: number;

    @BelongsTo(() => User)
    user!: User
}
