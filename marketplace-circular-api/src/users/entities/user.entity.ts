import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true, length: 100 })
  username!: string;

  @Column({ type: 'varchar', name: 'password_hash' })
  passwordHash!: string;

  @OneToMany(() => ProductEntity, (product) => product.user)
  products!: ProductEntity[];
}
