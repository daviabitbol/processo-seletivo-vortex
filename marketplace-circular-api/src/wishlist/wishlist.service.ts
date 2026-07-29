import {
    BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { ReturnWishlistDto } from './dto/ReturnWishlist.dto';
import { ProductEntity } from '../product/entities/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly wishlistRepository: Repository<WishlistEntity>,
  ) {}

  async add(userId: string, productId: string): Promise<ReturnWishlistDto> {
    if (!userId || !productId) {
      throw new NotFoundException(
        'Usuário não autenticado ou ID do produto inválido.',
      );
    }

    const product = await this.wishlistRepository.manager.findOne(ProductEntity, {
      where: { id: productId },
      relations: { user: true },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    const isMyProduct = userId === product.user.id;
    if (isMyProduct) {
        throw new BadRequestException('Você não pode adicionar o seu próprio produto à lista de desejos.')
    }
    const productAlreadyExists = await this.wishlistRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
    });

    if (productAlreadyExists) {
      throw new ConflictException(
        'Este produto já está na sua lista de desejos.',
      );
    }

    const wishlistItem = this.wishlistRepository.create({
      user: { id: userId },
      product: { id: productId },
    });

    const savedItem = await this.wishlistRepository.save(wishlistItem);

    const itemWithRelations = await this.wishlistRepository.findOne({
      where: { id: savedItem.id },
      relations: {
        product: {
          user: true,
        },
      },
    });

    return this.mapEntityToDto(itemWithRelations!);
  }

  async findAll(userId: string, page: number = 1, limit: number = 10): Promise<{
  data: ReturnWishlistDto[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}> {
    if (!userId) {
      throw new UnauthorizedException(
        'Usuário não autenticado ou token inválido.',
      );
    }

    const skip = (page - 1) * limit;

    const [wishlistItems, total] = await this.wishlistRepository.findAndCount({
      where: {
        user: { id: userId },
      },
      relations: {
        product: {
          user: true,
        },
      },
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit)

    return {
      data: wishlistItems.map((item) => this.mapEntityToDto(item)),
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: totalPages,
      },
    };
  }

  async remove(userId: string, productId: string): Promise<void> {
    if (!userId || !productId) {
      throw new NotFoundException(
        'Usuário não autenticado ou ID do produto inválido.',
      );
    }
    const wishlistItem = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!wishlistItem) {
      throw new NotFoundException(
        'Produto não encontrado na lista de desejos.',
      );
    }

    await this.wishlistRepository.remove(wishlistItem);
  }

  private mapEntityToDto(item: WishlistEntity): ReturnWishlistDto {
    return {
      id: item.id,
      createdAt: item.createdAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        type: item.product.type,
        state: item.product.state,
        availability: item.product.availability,
        user: item.product.user
          ? {
              id: item.product.user.id,
              username: item.product.user.username,
            }
          : undefined,
      } as any,
    };
  }
}
