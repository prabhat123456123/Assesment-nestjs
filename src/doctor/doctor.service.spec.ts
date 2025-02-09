import { Test, TestingModule } from '@nestjs/testing';
import { DoctorService } from './doctor.service';
import { getModelToken } from '@nestjs/sequelize';
import { Doctor,Category } from './schemas/doctor.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';

describe('DoctorService', () => {
  let doctorService: DoctorService;
  let doctorRepository: typeof Doctor;

  const mockDoctor = {
    id: 1,
    name: 'New Doctor',
    category: 'CARDIOLOGIST',
    save: jest.fn().mockResolvedValue(this),
  };

  const mockDoctorRepository = {
    findAll: jest.fn().mockResolvedValue([mockDoctor]),
    create: jest.fn().mockResolvedValue(mockDoctor),
    findByPk: jest.fn().mockImplementation((id) =>
      id === 1 ? Promise.resolve(mockDoctor) : Promise.resolve(null)
    ),
    update: jest.fn().mockResolvedValue([1, [mockDoctor]]),
    destroy: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService,
        {
          provide: getModelToken(Doctor),
          useValue: mockDoctorRepository,
        },
      ],
    }).compile();

    doctorService = module.get<DoctorService>(DoctorService);
    doctorRepository = module.get<typeof Doctor>(getModelToken(Doctor));
  });

  describe('findAll', () => {
    it('should return an array of doctors', async () => {
      const result = await doctorService.findAll({ page: '1', keyword: 'test' });
      expect(doctorRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockDoctor]);
    });
  });

  describe('create', () => {
    it('should create and return a doctor', async () => {
      const newDoctor: CreateDoctorDto = { name: 'New Doctor', category: Category.CARDIOLOGIST };
      const result = await doctorService.create(newDoctor);
      expect(doctorRepository.create).toHaveBeenCalledWith(newDoctor);
      expect(result).toEqual(mockDoctor);
    });
  });

  describe('findById', () => {
    it('should find and return a doctor by ID', async () => {
      const result = await doctorService.findById(1);
      expect(doctorRepository.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDoctor);
    });

    it('should throw NotFoundException if doctor is not found', async () => {
      await expect(doctorService.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateById', () => {
    it('should update and return a doctor', async () => {
      const updatedDoctor = { name: 'Updated name',category: Category.CARDIOLOGIST};
      const result = await doctorService.updateById(1, updatedDoctor);
      expect(doctorRepository.update).toHaveBeenCalledWith(updatedDoctor, { where: { id: 1 }, returning: true });
      expect(result.name).toEqual(updatedDoctor.name);
    });
  });

  describe('deleteById', () => {
    it('should delete and return success', async () => {
      const result = await doctorService.deleteById(1);
      expect(doctorRepository.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ deleted: true });
    });
  });
});
