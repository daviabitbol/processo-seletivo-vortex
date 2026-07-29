import { Exclude } from 'class-transformer';
import { ReturnProductDto } from '../../product/dto/ReturnProduct.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnUserDto {
  @Exclude()
  @ApiProperty()
  id!: string;
  @ApiProperty()
  username!: string;
  @ApiProperty()
  products?: ReturnProductDto[];
}
