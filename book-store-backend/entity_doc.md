Got it. Your SQL schema is clean and well-structured. You asked for **TypeORM entities** for each table **except `roles`**, since you'll use an enum instead.

Below is the full TypeScript code for your TypeORM entities (PostgreSQL + UUID + enum-based roles).
I’ll assume you're using **TypeORM v0.3+** syntax (with `@PrimaryGeneratedColumn('uuid')` etc.).

---

### 🧩 `UserRole` enum

```typescript
// Note: This enum should be created in src/core/enums/role.enum.ts
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',  // Using USER instead of CUSTOMER to match existing enum in user.entity.ts
}
```

---

### 🧠 `User` entity

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { Review } from 'src/modules/product/entities/review.entity';
import { Role } from 'src/core/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
```

---

### 📦 `Category` entity

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Book } from 'src/modules/product/entities/book.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Book, (book) => book.categories)
  books: Book[];
}
```

---

### ✍️ `Author` entity

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Book } from 'src/modules/product/entities/book.entity';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Book, (book) => book.authors)
  books: Book[];
}
```

---

### 🛍️ `Product` entity

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { Review } from './review.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'description_summary', nullable: true })
  descriptionSummary?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ name: 'rating_count', default: 0 })
  ratingCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Book, (book) => book.product)
  book: Book;

  @OneToMany(() => CartItem, (item) => item.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems: OrderItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}
```

---

### 📚 `Book` entity

```typescript
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
import { Author } from '../author/entities/author.entity';
import { Category } from '../category/entities/category.entity';

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
```

---

### 🛒 `Cart` entity

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];
}
```

---

### 🧾 `CartItem` entity

```typescript
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../product/entities/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
```

---

### 🧾 `Order` entity

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'order_date' })
  orderDate: Date;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: 'Completed' })
  status: string;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}
```

---

### 📦 `OrderItem` entity

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../product/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
```

---

### 💬 `Review` entity

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from '../user/entities/user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: true })
  rating?: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

---

All entities have been created with proper imports. Below are the final entities that should be created in their respective modules:

* `src/modules/author/entities/author.entity.ts`
* `src/modules/cart/entities/cart.entity.ts`
* `src/modules/cart/entities/cart-item.entity.ts`
* `src/modules/order/entities/order.entity.ts`
* `src/modules/order/entities/order-item.entity.ts`
* `src/modules/product/entities/product.entity.ts`
* `src/modules/product/entities/book.entity.ts`
* `src/modules/product/entities/review.entity.ts`
