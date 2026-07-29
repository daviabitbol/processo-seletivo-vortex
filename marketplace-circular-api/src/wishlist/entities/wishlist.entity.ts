import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { UserEntity as User } from "../../users/entities/user.entity";
import { ProductEntity as Product } from "../../product/entities/product.entity";

@Entity({ name: "wishlist" })
export class WishlistEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @CreateDateColumn()
  createdAt!: Date;
}