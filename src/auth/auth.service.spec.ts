import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { UniqueConstraintError } from 'sequelize';
import { Response } from 'express';

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
      expect(userRepository.create).toHaveBeenCalledWith({
        name: signUpDto.name,
        email: signUpDto.email,
        password: 'hashedPassword',
        role: ['admin'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw duplicate email entered', async () => {
      jest.spyOn(userRepository, 'create').mockRejectedValue(new UniqueConstraintError({ errors: [] })); // Mock correct error

      await expect(authService.signUp(signUpDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('logIn', () => {
    const loginDto = {
      email: 'test1@gmail.com',
      password: '12345678',
    };
   let res: any; // Mock Response object

   beforeEach(() => {
     res = {
       cookie: jest.fn(), // Mock res.cookie()
       json: jest.fn(),   // Mock res.json()
     };
   });

    it('should login user and return the token', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.login(loginDto,res);

      expect(res.cookie).toHaveBeenCalledWith('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      expect(res.json).toHaveBeenCalledWith({ message: 'Logged In....', token });
    });

    it('should throw invalid email error', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      
      await expect(authService.login(loginDto,res)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw invalid password error', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.login(loginDto,res)).rejects.toThrow(UnauthorizedException);
    });
  });
  
  // describe('logout', () => {
  //   let authService: AuthService;
  //   let mockResponse: Partial<Response>;
  
  //   beforeEach(async () => {
  //     const module: TestingModule = await Test.createTestingModule({
  //       providers: [AuthService],
  //     }).compile();
  
  //     authService = module.get<AuthService>(AuthService);
  
  //     // Mock only the necessary functions from Response
  //     mockResponse = {
  //       cookie: jest.fn(),
  //       json: jest.fn(),
  //     } as Partial<Response> as Response; // Ensure it matches Response type
  //   });
  
  //   it('should clear the auth_token cookie and return a success message', async () => {
  //     await authService.logout(mockResponse as Response);
  
  //     expect(mockResponse.cookie).toHaveBeenCalledWith('auth_token', '', {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       sameSite: 'strict',
  //       expires: new Date(0),
  //     });
  
  //     expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
  //   });
  // });
  
  

});
