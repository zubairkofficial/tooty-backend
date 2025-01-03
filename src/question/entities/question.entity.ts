// src/models/Question.model.js
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { Option } from 'src/option/entities/option.entity';

@Table({ tableName: 'questions' })
export class Question extends Model<Question> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  text: string;

  @Column({ type: DataType.ENUM('multiple-choice', 'question-answer'), allowNull: false })
  questionType: string;

  @ForeignKey(() => Quiz)
  @Column({ type: DataType.INTEGER, allowNull: false })
  quizId: number;

  @BelongsTo(() => Quiz)
  quiz: Quiz;

  @HasMany(() => Option)
  options: Option[];
}