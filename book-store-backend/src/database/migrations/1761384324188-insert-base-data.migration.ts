import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export class InsertBaseData1761384324188 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(path.join(__dirname, '../seeds/01_insert_base_data.sql'), 'utf8');
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    
  }
}
