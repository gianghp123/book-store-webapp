import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { Author } from '../author/entities/author.entity';
import { Book } from './entities/book.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Author, Book]),
    ClientsModule.register([
      {
        name: 'SEARCH_ENGINE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'protos',
          protoPath: join(__dirname, '../../protos/retriever.proto'),
          url: `${process.env.GRPC_URL || 'localhost:50051'}`,
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
