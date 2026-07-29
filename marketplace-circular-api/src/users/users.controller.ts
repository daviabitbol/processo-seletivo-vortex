import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ReturnUserDto } from './dto/ReturnUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOkResponse()
  @ApiBearerAuth()
  async create(@Body() user: CreateUserDto): Promise<ReturnUserDto>{
    return await this.usersService.create(user);
  }
}
