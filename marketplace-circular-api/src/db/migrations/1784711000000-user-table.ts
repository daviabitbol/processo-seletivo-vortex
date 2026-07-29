import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1784711000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying(100) NOT NULL,
                "password_hash" character varying NOT NULL,
                CONSTRAINT "UQ_user_username" UNIQUE ("username"),
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
    }
}