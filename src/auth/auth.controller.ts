import { Body, Controller, Get, Post,Res } from '@nestjs/common';
import { Response } from 'express'; 
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
   login(@Body() loginDto: LoginDto, @Res() res: Response ): Promise<{ mesaage:string,token: string }> {
   return this.authService.login(loginDto,res);
  }
 

  @Get('/logout')
  logout(@Res() res: Response): Promise<{ mesaage:string }> {
    return this.authService.logout(res);
  }

}
