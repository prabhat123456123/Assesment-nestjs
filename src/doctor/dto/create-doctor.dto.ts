import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/doctor.schema';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter a correct category.' })
  readonly category: Category;
}
