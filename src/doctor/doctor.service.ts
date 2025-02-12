import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Doctor } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Query } from 'express-serve-static-core';
import { uploadImages } from '../utils/aws';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor)
    private doctorModel: typeof Doctor,
  ) {}

  async findAll(query: Query): Promise<Doctor[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const offset = resPerPage * (currentPage - 1);

    const whereClause = query.keyword
      ? {
          name: {
            ["$like"]: `%${query.keyword}%`,
          },
        }
      : {};

    const doctors = await this.doctorModel.findAll({
      where: whereClause,
      limit: resPerPage,
      offset: offset,
    });
    return doctors;
  }

  async create(doctorDto: CreateDoctorDto): Promise<Doctor> {
    return await this.doctorModel.create(doctorDto);
  }

  async findById(id: number): Promise<Doctor> {
    const doctor = await this.doctorModel.findByPk(id);
    if (!doctor) {
      throw new NotFoundException('Doctor not found.');
    }
    return doctor;
  }

  async updateById(id: number, doctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findById(id);
    await doctor.update(doctorDto);
    return doctor;
  }

  async deleteById(id: number): Promise<{ deleted: boolean }> {
    const deletedCount = await this.doctorModel.destroy({ where: { id } });
    if (!deletedCount) {
      throw new NotFoundException('Doctor not found.');
    }
    return { deleted: true };
  }

  async uploadImages(id: number, files: Array<Express.Multer.File>) {
    const doctor = await this.findById(id);
    if (!doctor) {
      throw new NotFoundException('Doctor not found.');
    }

    const images = await uploadImages(files);
    doctor.images = images as object[];
    await doctor.save();

    return doctor;
  }
}
