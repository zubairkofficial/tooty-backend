import {
  Column,
  DataType,
  Default,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { RefreshToken } from './refreshToken.entity';
// import { Bot } from '../../bot/entities/bot.entity';
import { File } from 'src/context_data/entities/file.entity';
import { Role } from 'src/utils/roles.enum';
import { Profile } from 'src/profile/entities/profile.entity';
import { API } from 'src/api/entities/api.entity';
import { Bot } from 'src/bot/entities/bot.entity';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true
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

  @Column({
    type: DataType.ENUM,
    values: Object.values(Role), // You can provide the enum values here
  })
  role: Role;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isVerified: boolean;

  @HasOne(() => RefreshToken)
  refresh_token!: RefreshToken;

  @HasOne(() => Profile)
  profile!: Profile;

  @HasMany(() => API)
  api!: API

  @HasMany(() => Bot)
  bots!: Bot[]

  @HasMany(() => File)
  files!: File[]
}
