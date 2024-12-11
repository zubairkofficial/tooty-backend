import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Bot } from 'src/bot/entities/bot.entity';

import { User } from 'src/user/entities/user.entity';


@Table
export class Chat extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => Bot)
  @Column
  bot_id: number;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @Column({ type: DataType.TEXT })
  message: string;

  @Column({ type: DataType.STRING })
  image_url: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_bot: boolean;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Bot)
  bot!: Bot;
}
