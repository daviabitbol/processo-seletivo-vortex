import { MigrationInterface, QueryRunner } from "typeorm";

export class WishlistTable1784711999999 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "wishlist" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "productId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_wishlist_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_wishlist_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_wishlist_product" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "wishlist"`);
    }
}