// src/models/Quiz.model.js
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Level } from 'src/level/entity/level.entity';
import { Question } from 'src/question/entities/question.entity';
import { Subject } from 'src/subject/entity/subject.entity';

@Table({ tableName: 'quizzes' })
export class Quiz extends Model<Quiz> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.ENUM('multiple-choice', 'question-answer'), allowNull: false })
  quizType: string;

  @Column({ type: DataType.DATE, allowNull: false })
  startTime: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  endTime: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  duration: number; // Duration in minutes

  @ForeignKey(() => Level)
  @Column({ type: DataType.INTEGER, allowNull: false })
  levelId: number;

  @BelongsTo(() => Level)
  level: Level;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.INTEGER, allowNull: false })
  subjectId: number;

  @BelongsTo(() => Subject)
  subject: Subject;

  @HasMany(() => Question)
  questions: Question[];
}