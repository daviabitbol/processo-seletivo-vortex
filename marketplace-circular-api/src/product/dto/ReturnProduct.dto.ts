import { ApiProperty } from '@nestjs/swagger';
import {
  ProductAvailability,
  ProductState,
  ProductType,
} from './../entities/product.entity';

export class ReturnProductDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;
  @ApiProperty()
  description!: string;
  @ApiProperty()
  price?: number;
  @ApiProperty()
  type!: ProductType;
  @ApiProperty()
  state!: ProductState;
  @ApiProperty()
  availability?: ProductAvailability;
  @ApiProperty()

  user?: {
    id: string;
    username: string;
  };
}
