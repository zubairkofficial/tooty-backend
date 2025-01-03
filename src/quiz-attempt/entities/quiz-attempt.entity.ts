import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { User } from 'src/user/entities/user.entity';

@Table({ tableName: 'quiz_attempts' }) // Define the table name
export class QuizAttempt extends Model<QuizAttempt> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Quiz)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quizId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  score: number;

  @BelongsTo(() => Quiz)
  quiz: Quiz;

  @BelongsTo(() => User)
  user: User;
}