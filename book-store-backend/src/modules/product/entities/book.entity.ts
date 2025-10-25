import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Author } from 'src/modules/author/entities/author.entity';
import { Category } from 'src/modules/category/entities/category.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.book, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'file_format', default: 'PDF' })
  fileFormat: string;

  @Column({
    name: 'file_url',
    default: 'https://tourism.gov.in/sites/default/files/2019-04/dummy-pdf_2.pdf',
  })
  fileUrl: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @ManyToMany(() => Author, (author) => author.books, { cascade: true })
  @JoinTable({
    name: 'book_authors',
    joinColumn: { name: 'book_id' },
    inverseJoinColumn: { name: 'author_id' },
  })
  authors: Author[];

  @ManyToMany(() => Category, (category) => category.books, { cascade: true })
  @JoinTable({
    name: 'book_categories',
    joinColumn: { name: 'book_id' },
    inverseJoinColumn: { name: 'category_id' },
  })
  categories: Category[];
}