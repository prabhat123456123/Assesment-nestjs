import { Test, TestingModule } from '@nestjs/testing';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { Category } from './schemas/doctor.schema';
import { PassportModule } from '@nestjs/passport';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

describe('DoctorController', () => {
  let doctorService: DoctorService;
  let doctorController: DoctorController;

  const mockDoctor = {
    id: 1,
    name: 'New Doctor',
    category: Category.CARDIOLOGIST,
  };


  const mockDoctorService = {
    findAll: jest.fn().mockResolvedValueOnce([mockDoctor]),
    create: jest.fn(),
    findById: jest.fn().mockResolvedValueOnce(mockDoctor),
    updateById: jest.fn(),
    deleteById: jest.fn().mockResolvedValueOnce({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [DoctorController],
      providers: [
        {
          provide: DoctorService,
          useValue: mockDoctorService,
        },
      ],
    }).compile();

    doctorService = module.get<DoctorService>(DoctorService);
    doctorController = module.get<DoctorController>(DoctorController);
  });

  it('should be defined', () => {
    expect(doctorController).toBeDefined();
  });

  describe('getAllDoctors', () => {
    it('should get all doctors', async () => {
      const result = await doctorController.getAllDoctors({
        page: '1',
        keyword: 'test',
      });

      expect(doctorService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockDoctor]);
    });
  });

  describe('createDoctor', () => {
    it('should create a new Doctor', async () => {
      const newDoctor = {
        name: 'New Doctor',
        category: Category.NEPHROLOGIST,
      };

      mockDoctorService.create = jest.fn().mockResolvedValueOnce(mockDoctor);

      const result = await doctorController.createDoctor(
        newDoctor as CreateDoctorDto
      );

      expect(doctorService.create).toHaveBeenCalled();
      expect(result).toEqual(mockDoctor);
    });
  });

  describe('getDoctorById', () => {
    it('should get a Doctor by ID', async () => {
      const result = await doctorController.getDoctor(mockDoctor.id);

      expect(doctorService.findById).toHaveBeenCalled();
      expect(result).toEqual(mockDoctor);
    });
  });

  describe('updateDoctor', () => {
    it('should update Doctor by its ID', async () => {
      const updatedDoctor = { ...mockDoctor, name: 'Updated name' };
      const doctor = { name: 'Updated name' };

      mockDoctorService.updateById = jest.fn().mockResolvedValueOnce(updatedDoctor);

      const result = await doctorController.updateDoctor(
        mockDoctor.id,
        doctor as UpdateDoctorDto,
      );

      expect(doctorService.updateById).toHaveBeenCalled();
      expect(result).toEqual(updatedDoctor);
    });
  });

  describe('deleteDoctor', () => {
    it('should delete a Doctor by ID', async () => {
      const result = await doctorController.deleteDoctor(mockDoctor.id);

      expect(doctorService.deleteById).toHaveBeenCalled();
      expect(result).toEqual({ deleted: true });
    });
  });
});
