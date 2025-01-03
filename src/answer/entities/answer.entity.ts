// src/answer/answer.model.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { QuizAttempt } from 'src/quiz-attempt/entities/quiz-attempt.entity';
import { Option } from 'src/option/entities/option.entity';

@Table({ tableName: 'answers' })
export class Answer extends Model<Answer> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  isCorrect: boolean;

  @ForeignKey(() => QuizAttempt)
  @Column({ type: DataType.INTEGER, allowNull: false })
  attemptId: number;

  @BelongsTo(() => QuizAttempt)
  attempt: QuizAttempt;

  @ForeignKey(() => Option)
  @Column({ type: DataType.INTEGER, allowNull: false })
  optionId: number;

  @BelongsTo(() => Option)
  selectedOption: Option;
}