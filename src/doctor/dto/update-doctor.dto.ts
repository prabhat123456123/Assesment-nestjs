import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/doctor.schema';

export class UpdateDoctorDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsEnum(Category, { message: 'Please enter correct category.' })
  readonly category: Category;

 
}
