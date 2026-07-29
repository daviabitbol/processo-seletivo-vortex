import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { IsOptional } from 'class-validator';

export enum ProductType {
  DONATION = 'doacao',
  SALE = 'venda',
  TRADE = 'troca',
}

export enum ProductState {
  NEW = 'novo',
  SEMI_NEW = 'semi_novo',
  USED = 'usado',
}

export enum ProductAvailability {
  AVAILABLE = 'disponivel',
  UNAVAILABLE = 'indisponivel',
}

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsOptional()
  id?: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  price?: number;

  @Column({ type: 'enum', enum: ProductType, default: ProductType.SALE })
  type!: ProductType;

  @Column({ type: 'enum', enum: ProductState })
  state!: ProductState;

  @Column({
    type: 'enum',
    enum: ProductAvailability,
    default: ProductAvailability.AVAILABLE,
  })
  availability?: ProductAvailability;

  @ManyToOne(() => UserEntity, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
