import {
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';


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
}
