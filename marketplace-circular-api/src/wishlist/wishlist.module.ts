import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistEntity])],
  providers: [WishlistService],
  controllers: [WishlistController]
})
export class WishlistModule {}
