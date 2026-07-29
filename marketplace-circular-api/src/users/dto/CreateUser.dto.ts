import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  id!: string;
  @IsString()
  @MaxLength(20)
  @ApiProperty()
  username!: string;
  @IsString()
  @ApiProperty()
  password!: string;
}
