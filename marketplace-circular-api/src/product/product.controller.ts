import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import * as CreateproductDto from './dto/Createproduct.dto';
import { ProductService } from './product.service';
import { ReturnProductDto } from './dto/ReturnProduct.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @ApiCreatedResponse({
    type: ReturnProductDto
  })
  @ApiBearerAuth()
  async create(
    @Body() product: CreateproductDto.CreateProductDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub || req.user.id;
    return await this.productService.create(product, userId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: ReturnProductDto
  })
  @ApiBearerAuth()
  async findById(@Param('id') id: string): Promise<ReturnProductDto> {
    return await this.productService.findById(id);
  }

  @Get()
  @ApiOkResponse({
    type: [ReturnProductDto]
  })
  @ApiBearerAuth()
  async findAll(
    @Query() params: CreateproductDto.findAllProductParameters,
  ): Promise<ReturnProductDto[]> {
    return this.productService.findAll(params);
  }

  @Put(':id')
  @ApiOkResponse()
  @ApiBearerAuth()
  async update(
    @Param() params: CreateproductDto.ProductRouteParams,
    @Body() product: ReturnProductDto,
  ) {
    await this.productService.update(params.id, product);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiBearerAuth()
    remove(@Param('id') id:string) {
        return this.productService.remove(id)
    }

}
