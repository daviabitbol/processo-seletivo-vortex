import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductTable1784712000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."product_type_enum" AS ENUM('doacao', 'troca', 'venda');
            EXCEPTION WHEN duplicate_object THEN null; END $$;
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."product_state_enum" AS ENUM('novo', 'semi_novo', 'usado');
            EXCEPTION WHEN duplicate_object THEN null; END $$;
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."product_availability_enum" AS ENUM('disponivel', 'indisponivel');
            EXCEPTION WHEN duplicate_object THEN null; END $$;
        `);
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "product" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text NOT NULL,
                "price" numeric(10,2) NOT NULL DEFAULT '0',
                "type" "public"."product_type_enum" NOT NULL DEFAULT 'venda',
                "state" "public"."product_state_enum" NOT NULL,
                "availability" "public"."product_availability_enum" NOT NULL DEFAULT 'disponivel',
                "user_id" uuid,
                CONSTRAINT "PK_product_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_product_user" FOREIGN KEY ("user_id") 
                    REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT IF EXISTS "FK_product_user"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."product_availability_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."product_state_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."product_type_enum"`);
    }
}