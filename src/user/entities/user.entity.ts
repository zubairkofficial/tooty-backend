import {
  Column,
  DataType,
  Default,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { RefreshToken } from './refreshToken.entity';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @Column({
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  contact: string;

  @Column({
    type: DataType.STRING,
  })
  password: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isVerified: boolean;

  @HasOne(() => RefreshToken)
  refresh_token!: RefreshToken;
}
