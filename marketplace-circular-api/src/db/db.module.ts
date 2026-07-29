import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../product/entities/product.entity';
import { WishlistEntity } from '../wishlist/entities/wishlist.entity';
import { MessageEntity } from '../chat/entities/message.entity';

@Module({
    imports: [TypeOrmModule.forRootAsync({
        useFactory: async (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: +configService.getOrThrow<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            entities: [UserEntity, ProductEntity, WishlistEntity, MessageEntity],
            migrations: [__dirname + '/migrations/*.ts'],
            synchronize: false,
        }),
        inject: [ConfigService]
    })]
})
export class DbModule {}
