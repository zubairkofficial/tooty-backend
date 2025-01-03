// src/models/Option.model.js
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Question } from 'src/question/entities/question.entity';

@Table({ tableName: 'options' })
export class Option extends Model<Option> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  text: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isCorrect: boolean;

  @ForeignKey(() => Question)
  @Column({ type: DataType.INTEGER, allowNull: false })
  questionId: number;

  @BelongsTo(() => Question)
  question: Question;
}