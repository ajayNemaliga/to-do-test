import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  dataservice: any;
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtservice: JwtService
  ) {
    console.log('AuthService initialized');
    console.log('Environment Variables in AuthService:');
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
  }


  async login(loginData: LoginDto) {
    console.log(loginData);
    const { email, password } = loginData;
    console.log(email, password);
    console.log(
      this.databaseService.user.findFirst({
        where: {
          email: email,
        },
      }),
    );
    const user = await this.databaseService.user.findFirst({
      where:{
        email: email
      }
    })
    if (!user) {
      throw new NotFoundException('No user exits with the enterted email');
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      throw new NotFoundException('Wrong Password');
    }
    return {
      token: this.jwtservice.sign({ email }),
    }
  }
  async register(registerData: RegisterUserDto) {
    const user = await this.databaseService.user.findFirst({
      where:{
        email: registerData.email
      }
    })
    console.log('User:', user);
    if (user) {
      throw new BadGatewayException('User with this email already exits')
    }
    registerData.password = await bcrypt.hash(registerData.password, 10);
    const res = await this.databaseService.user.create({ data: registerData })
    return res;
  }
}
