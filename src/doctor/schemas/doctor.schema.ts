import { Table, Column, Model, DataType } from 'sequelize-typescript';

// ✅ Define the Category Enum
export enum Category {
  CARDIOLOGIST = 'Cardiologist',
  NEUROLOGIST = 'Neurologist',
  NEPHROLOGIST = 'Nephrologist',
  ONCOLOGIST = 'Oncologist',
}

@Table({
  tableName: 'doctors',
  timestamps: true, // ✅ Enables createdAt & updatedAt fields
  underscored: true, // ✅ Converts camelCase fields to snake_case in DB
})
export class Doctor extends Model<Doctor> {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  id: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // ✅ Prevents empty string input
    },
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(Category)), // ✅ Correct ENUM handling
    allowNull: false,
  })
  category: Category;

  @Column({
    type: DataType.JSONB, // ✅ Best for storing objects/arrays in PostgreSQL
    allowNull: true,
  })
  images?: object[];
}
