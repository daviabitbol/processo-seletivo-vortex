import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    ProductModule,
    DbModule,
    WishlistModule,
    ChatModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [AppService],
})
export class AppModule {}
