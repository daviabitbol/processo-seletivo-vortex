import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthResponseDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { AuthCreateDto } from './AuthCreate.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiCreatedResponse({
    type: AuthResponseDto,
  })
  async signIn(@Body() authCreateDto: AuthCreateDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(authCreateDto);
  }
}
