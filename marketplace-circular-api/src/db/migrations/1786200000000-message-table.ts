import { MigrationInterface, QueryRunner } from "typeorm";

export class MessageTable1784712000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "message" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "room" varchar NOT NULL,
                "senderId" varchar NOT NULL,
                "content" text NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_message_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "message"`);
    }
}