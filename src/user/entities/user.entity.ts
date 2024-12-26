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
import { StudentProfile } from 'src/profile/entities/student-profile.entity';
import { API } from 'src/api/entities/api.entity';
import { Bot } from 'src/bot/entities/bot.entity';
import { TeacherProfile } from 'src/profile/entities/teacher-profile.entity';

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
  user_image_url: string;

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

  @HasOne(() => StudentProfile)
  student_profile: StudentProfile;

  @HasOne(() => TeacherProfile)
  teacher_profile: TeacherProfile

  @HasMany(() => API)
  api!: API

  @HasMany(() => Bot)
  bots!: Bot[]

  @HasMany(() => File)
  files!: File[]
}
