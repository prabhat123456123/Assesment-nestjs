import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';
import { Role } from '../enums/role.enum';

@Table({
  tableName: 'users',
  timestamps: true, // Enables createdAt & updatedAt fields
})
export class User extends Model<User> {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  id: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true, // Ensures uniqueness in DB
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING), // Stores roles as an array of strings
    defaultValue: [Role.ADMIN], // Default role is 'User'
  })
  role: string[];
}
