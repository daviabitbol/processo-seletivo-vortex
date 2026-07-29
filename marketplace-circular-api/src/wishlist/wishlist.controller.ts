import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { ReturnWishlistDto } from './dto/ReturnWishlist.dto';

export class PaginationMetaDto {
  @ApiProperty({ example: 12, description: 'Total de itens encontrados' })
  totalItems!: number;

  @ApiProperty({ example: 10, description: 'Quantidade de itens por página' })
  itemsPerPage!: number;

  @ApiProperty({ example: 1, description: 'Página atual' })
  currentPage!: number;

  @ApiProperty({ example: 2, description: 'Total de páginas disponíveis' })
  totalPages!: number;
}

@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':id')
  @ApiCreatedResponse({
    type: ReturnWishlistDto
  })
  @ApiBearerAuth()
  addToWishlist(@Req() req, @Param('id') id: string) {
    const userId = req.user?.id || req.user?.sub;
    return this.wishlistService.add(userId, id);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Produto removido'
  })
  @ApiBearerAuth()
  removeFromWishlist(@Req() req, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.wishlistService.remove(userId, id);
  }

  @Get()
  @ApiOkResponse({
    type: ReturnWishlistDto,
    description: 'Lista de desejos paginada do usuário'
  })
  getWishlist(
    @Req() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    const userId = req.user?.id || req.user?.sub;

    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const limitNumber = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;

    return this.wishlistService.findAll(userId, pageNumber, limitNumber); 
  }
}
