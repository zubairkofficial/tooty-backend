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
import { User } from './user.entity';

@Table({
  tableName: 'refreshTokens',
  timestamps: false,
})
export class RefreshToken extends Model {
  @PrimaryKey
  @Column({
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  refresh_token: string;

  @Unique
  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user!: User;
}
