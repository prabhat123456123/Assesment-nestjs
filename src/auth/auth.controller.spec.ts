import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;


  let jwtToken = 'jwtToken';

  const mockAuthService = {
    signUp: jest.fn().mockResolvedValueOnce(jwtToken),
    login: jest.fn().mockResolvedValueOnce(jwtToken),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should register a new user', async () => {
      const signUpDto = {
        name: 'test',
        email: 'test@gmail.com',
        password: '12345678',
        role:['Admin']
      };

      const result = await authController.signUp(signUpDto);
      expect(authService.signUp).toHaveBeenCalled();
      expect(result).toEqual(jwtToken);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const loginDto = {
        email: 'test@gmail.com',
        password: '12345678',
      };
      let res: any; // Mock Response object

      const result = await authController.login(loginDto,res);
      expect(authService.login).toHaveBeenCalled();
      expect(result).toEqual(jwtToken);
    });
  });
  // describe('logout', () => {
  //   it('should logout user', async () => {
    
  //     let res: any; // Mock Response object

  //     const result = await authController.logout(res);
  //     expect(authService.logout).toHaveBeenCalled();
  //     expect(result).toEqual("message");
  //   });
  // });
});
