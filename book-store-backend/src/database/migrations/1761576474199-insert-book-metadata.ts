import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

export class UpdateBookMetadata1761576474199 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const filePath = path.join(__dirname, '../seeds/books_metadata.csv');
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(csvContent, { columns: true, skip_empty_lines: true });

    const batchSize = 5000;
    let totalUpdated = 0;

    await queryRunner.startTransaction();
    try {
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);

        const values = batch
          .filter((r: any) => r.title && r.coverImg) // required fields
          .map((r: any) => {
            const title = r.title.replace(/'/g, "''").trim();
            const publisher = r.publisher?.replace(/'/g, "''").trim() || '';
            const pages = r.pages ? parseInt(r.pages, 10) : null;
            const isbn = r.isbn?.replace(/'/g, "''").trim() || '';
            const coverImg = r.coverImg.replace(/'/g, "''").trim();

            return `('${title}', '${coverImg}', '${publisher}', ${pages ?? 'NULL'}, '${isbn}')`;
          })
          .join(',\n');

        if (!values) continue;

        const sql = `
          UPDATE books AS b
        SET
        publisher = v.publisher,
        pages_count = v.pages_count,
        isbn = v.isbn
        FROM products p,
            (VALUES
            ${values}
            ) AS v(title, image_url, publisher, pages_count, isbn)
        WHERE b.product_id = p.id
        AND LOWER(p.title) = LOWER(v.title)
        AND b.image_url = v.image_url;
        `;

        await queryRunner.query(sql);
        totalUpdated += batch.length;
        console.log(`✅ Updated ${totalUpdated} rows so far...`);
      }

      await queryRunner.commitTransaction();
      console.log(`✅ Migration complete — ${totalUpdated} total records processed.`);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Migration failed, rolled back.', err);
      throw err;
    }
  }

  public async down(): Promise<void> {
    // No rollback for data updates
  }
}
