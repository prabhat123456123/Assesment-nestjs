import {
  Body,
  ConflictException,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './schemas/user.schema'; // Sequelize User Model
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express'; // Import Response from Express
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User, // Inject Sequelize model
    private readonly jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { name, email, password, role } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        role: role?.map((r) => r.toLowerCase()) || ['admin'],
      });

     
      return user;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException('Duplicate Email Entered');
      }
      throw error;
    }
  }


  async login(@Body() loginDto: LoginDto,@Res() res: Response): Promise<any> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user.id });
    // Store token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    let data = {message:"Logged In....",token }
    return res.json(data);
  }
  async logout(@Res() res: Response): Promise<any> {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Expire immediately,
      path: '/' // Ensure the cookie is cleared globally
    });

    return res.json({ message: "Logged out successfully" });
  }
}
