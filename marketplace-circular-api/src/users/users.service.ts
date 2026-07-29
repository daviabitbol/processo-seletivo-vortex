import { ConflictException, Injectable } from '@nestjs/common';
import { hashSync as bcrypthashSync } from 'bcrypt';
import { CreateUserDto } from './dto/CreateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ReturnUserDto } from './dto/ReturnUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(newUser: CreateUserDto): Promise<ReturnUserDto> {
    const userAlreadyRegistered = await this.findByUsername(newUser.username);

    if (userAlreadyRegistered) {
      throw new ConflictException(
        `User ${newUser.username} already registered`,
      );
    }

    const dbUser = new UserEntity();
    dbUser.username = newUser.username;
    dbUser.passwordHash = bcrypthashSync(newUser.password, 10);

    const { id, username } = await this.usersRepository.save(dbUser);

    return {
      id,
      username,
    };
  }

  async findByUsername(username: string): Promise<any | undefined> {
    const userFound = await this.usersRepository.findOne({
      where: { username },
    });

    if (!userFound) {
      return undefined;
    }

    return {
      id: userFound.id,
      username: userFound.username,
      password: userFound.passwordHash,
    };
  }
}