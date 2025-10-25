import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export class UpdateBaseData1761384324189 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(path.join(__dirname, '../seeds/02_update_product_summaries_batched.sql'), 'utf8');
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // optional rollback logic (reverse updates)
  }
}
