import { IsDate, IsUUID } from 'class-validator';
import { ReturnProductDto } from '../../product/dto/ReturnProduct.dto';

export class ReturnWishlistDto {
  @IsUUID()
  id!: string;
  @IsDate()
  createdAt!: Date;
  product!: ReturnProductDto;
}
