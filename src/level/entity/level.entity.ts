import {
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';


@Table({
    tableName: 'levels',
    timestamps: true,
    paranoid: true
})
export class Level extends Model {
    @PrimaryKey
    @Column({
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    id: number;

    @Unique
    @Column({
        type: DataType.STRING,
    })
    level: string;

    @Column({
        type: DataType.TEXT,
    })
    description: string;

}
