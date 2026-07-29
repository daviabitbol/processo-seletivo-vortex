import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import {
  ProductAvailability,
  ProductState,
  ProductType,
} from './../entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

export interface findAllProductParameters {
  name?: string;
  type?: string;
  availability?: string;
  state?: string;
}

export class ProductRouteParams {
  @IsUUID()
  id!: string;
}
export class CreateProductDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  id?: string;

  @IsString()
  @ApiProperty()
  name!: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description!: string;

  @IsNumber()
  @Min(0, { message: 'O preço não pode ser negativo' })
  @IsOptional()
  @ApiProperty()
  price?: number;

  @IsEnum(ProductType)
  @ApiProperty()
  type!: ProductType;

  @IsEnum(ProductState)
  @ApiProperty()
  state!: ProductState;

  @IsEnum(ProductAvailability)
  @IsOptional()
  @ApiProperty()
  availability?: ProductAvailability;

  @IsUUID()
  @IsOptional()
  @ApiProperty()
  userId?: string;
}
