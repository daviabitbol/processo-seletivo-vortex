import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import {
  ProductAvailability,
  ProductEntity,
  ProductState,
  ProductType,
} from './entities/product.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ReturnProductDto } from './dto/ReturnProduct.dto';
import { CreateProductDto, findAllProductParameters } from './dto/Createproduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(
    newProduct: CreateProductDto,
    userId: string | any,
  ): Promise<ReturnProductDto> {
    const cleanUserId =
      typeof userId === 'object' ? userId.id || userId.sub : userId;

    const productToSave: Partial<ProductEntity> = {
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      type: newProduct.type,
      state: newProduct.state,
      availability: newProduct.availability,
      user: { id: cleanUserId } as UserEntity,
    };

    const createdProduct = await this.productRepository.save(productToSave);

    return this.findById(createdProduct.id!);
  }

  async findById(id: string): Promise<ReturnProductDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!product) {
      throw new HttpException(
        `Product with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.mapEntityToDto(product);
  }

  async findAll(params: findAllProductParameters): Promise<ReturnProductDto[]> {
  const searchParams: FindOptionsWhere<ProductEntity> = {};

  if (params.name) {
    searchParams.name = ILike(`%${params.name}%`);
  }

  if (params.availability) {
    searchParams.availability = params.availability as ProductAvailability;
  }

  if (params.type) {
    searchParams.type = params.type as ProductType;
  }

  if (params.state) {
    searchParams.state = params.state as ProductState;
  }

  const foundProducts = await this.productRepository.find({
    where: searchParams,
    relations: { user: true },
  });

  return foundProducts.map((productEntity) =>
    this.mapEntityToDto(productEntity),
  );
}

  async update(id: string, productDto: CreateProductDto): Promise<ReturnProductDto> {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!existingProduct) {
      throw new HttpException(
        `Product with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedEntity = this.productRepository.merge(existingProduct, {
      name: productDto.name ?? existingProduct.name,
      description: productDto.description ?? existingProduct.description,
      price: productDto.price ?? existingProduct.price,
      type: productDto.type ?? existingProduct.type,
      state: productDto.state ?? existingProduct.state,
      availability: productDto.availability ?? existingProduct.availability,
    });

    const savedProduct = await this.productRepository.save(updatedEntity);

    return this.mapEntityToDto(savedProduct);
  }

  async remove(id: string) {
    const result = await this.productRepository.delete(id);

    if (!result.affected) {
      throw new HttpException(
        `Task with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapEntityToDto(productEntity: ProductEntity): ReturnProductDto {
    return {
      id: productEntity.id!,
      name: productEntity.name,
      description: productEntity.description,
      price: Number(productEntity.price),
      type: productEntity.type as ProductType,
      state: productEntity.state as ProductState,
      availability: productEntity.availability as ProductAvailability,
      ...(productEntity.user && {
        user: {
          id: productEntity.user.id,
          username: productEntity.user.username,
        },
      }),
    };
  }
}