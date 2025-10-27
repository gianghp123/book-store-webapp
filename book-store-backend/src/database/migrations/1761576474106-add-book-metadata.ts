import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookMetadata1761576474106 implements MigrationInterface {
    name = 'AddBookMetadata1761576474106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" ADD "publisher" character varying`);
        await queryRunner.query(`ALTER TABLE "books" ADD "pages_count" integer`);
        await queryRunner.query(`ALTER TABLE "books" ADD "isbn" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "isbn"`);
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "pages_count"`);
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "publisher"`);
    }

}
