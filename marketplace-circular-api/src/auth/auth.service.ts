import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './auth.dto';
import { compareSync as bcryptCompareSync} from 'bcrypt'
import { ConfigService } from '@nestjs/config';
import { AuthCreateDto } from './AuthCreate.dto';

@Injectable()
export class AuthService {
    private jwtExpirationTimeInSeconds: number;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.jwtExpirationTimeInSeconds = +this.configService.getOrThrow<number>('JWT_EXPIRATION_TIME')
  }
  async signIn(authCreateDto: AuthCreateDto): Promise<AuthResponseDto> {

    const foundUser = await this.usersService.findByUsername(authCreateDto.username);

    if (!foundUser) {
        throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const isPasswordValid = bcryptCompareSync(
        authCreateDto.password, 
        foundUser.password
    );

    if (!isPasswordValid) {
        throw new UnauthorizedException();
    }

    const payload = { 
        sub: foundUser.id, 
        username: foundUser.username 
    };

    const token = this.jwtService.sign(payload);

    return {
        token, 
        expiresIn: this.jwtExpirationTimeInSeconds
    };
}
}
