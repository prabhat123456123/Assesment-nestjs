import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    name: 'test',
    email: 'test1@gmail.com',
    password: 'hashedPassword',
  };

  const token = 'jwtToken';

  const mockUserRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getModelToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    const signUpDto = {
      name: 'test',
      email: 'test1@gmail.com',
      password: '12345678',
      role: ['admin'],
    };

    it('should register the new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(userRepository, 'create').mockResolvedValue(mockUser as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.signUp(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });

    it('should throw duplicate email entered', async () => {
      jest.spyOn(userRepository, 'create').mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });
      
      await expect(authService.signUp(signUpDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('logIn', () => {
    const loginDto = {
      email: 'test1@gmail.com',
      password: '12345678',
    };

    it('should login user and return the token', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.login(loginDto);

      expect(result).toEqual({ token });
    });

    it('should throw invalid email error', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      
      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw invalid password error', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
