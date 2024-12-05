import {
 BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import * as pgvector from 'pgvector/sequelize'
import { File } from './file.entity';

pgvector.registerType(Sequelize)
type Vector = number[];


@Table({
  tableName: 'context_data',
  timestamps: true,

})
export class ContextData extends Model {
  @PrimaryKey
  @Column({
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.TEXT
  })
  text_chunk: string;


  @Column({
    type: DataType.TEXT

    // validate: {
    //   len: [1536, 1536] // Ensure exactly 1536 dimensions
    // },

  })
  embedded_chunk: Vector;
  // Optional: Method to validate vector
  // static validateVector(vector: Vector): boolean {
  //   return vector.length === 1536 && vector.every(val => typeof val === 'number');
  // }



  @ForeignKey(() => File)
  @Column({
    type: DataType.INTEGER
  })
  file_id: number

  @BelongsTo(() => File)
  file: File;
}
