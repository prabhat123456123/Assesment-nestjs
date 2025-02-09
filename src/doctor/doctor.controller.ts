import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './schemas/doctor.schema';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('doctor')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  // @SkipThrottle()
  @Throttle({ default: { limit: 1, ttl: 2000 } })
  @Get()
  @Roles(Role.VIEWER, Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAllDoctors(@Query() query: ExpressQuery): Promise<Doctor[]> {
    return this.doctorService.findAll(query);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(),RolesGuard)
  async createDoctor(
    @Body()
    doctor: CreateDoctorDto
  ): Promise<Doctor> {
    return this.doctorService.create(doctor);
  }

  @Get(':id')
  async getDoctor(
    @Param('id')
    id: number,
  ): Promise<Doctor> {
    return this.doctorService.findById(id);
  }

  @Put(':id')
  @Roles(Role.EDITOR)
  @UseGuards(AuthGuard(),RolesGuard)
  async updateDoctor(
    @Param('id')
    id: number,
    @Body()
    doctor: UpdateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorService.updateById(id, doctor);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(),RolesGuard)
  async deleteDoctor(
    @Param('id')
    id: number,
  ): Promise<{ deleted: boolean }> {
    return this.doctorService.deleteById(id);
  }

  @Put('upload/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @Param('id') id: number,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1000 * 1000,
          message: 'File size must be less than 1MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.doctorService.uploadImages(id, files);
  }
}
