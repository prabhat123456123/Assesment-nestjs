import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './schemas/user.schema'; // Sequelize User Model
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
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

  async login(loginDto: LoginDto): Promise<{ token: string }> {
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
    return { token };
  }
}
