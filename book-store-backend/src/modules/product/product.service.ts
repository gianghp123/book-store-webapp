import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { Author } from '../author/entities/author.entity';
import { Book } from './entities/book.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFilterQueryDto } from './dto/product-filter-query.dto';
import { HybridSearchQueryDto } from './dto/hybrid-search-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { CategoryResponseDto } from '../category/dto/category-response.dto';
import { AuthorResponseDto } from '../author/dto/author-response.dto';
import { Query } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async findAll(@Query() filterQuery: ProductFilterQueryDto): Promise<PaginatedProductsDto> {
    const { page = 1, limit = 10, title, categoryIds, minPrice, maxPrice, sortBy, sortOrder } = filterQuery;
    const offset = (page - 1) * limit;

    const whereCondition: FindOptionsWhere<Product> = {};
    if (title) {
      whereCondition.title = Like(`%${title}%`);
    }

    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.book', 'book')
      .leftJoin('book.categories', 'categories')
      .where(whereCondition);

    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (categoryIds && categoryIds.length > 0) {
      queryBuilder.andWhere('book.categories.id IN (:...categoryIds)', { categoryIds });
    }

    if (sortBy) {
      const orderDirection = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      queryBuilder.orderBy(`product.${sortBy}`, orderDirection);
    } else {
      queryBuilder.orderBy('product.createdAt', 'DESC');
    }

    const [products, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const data = products.map(product => {
      // Transform product and include categories in the response
      const productDto = ProductResponseDto.fromEntity(product);
      // Add categories to the response from the book
      if (product.book && product.book.categories) {
        productDto.categories = product.book.categories.map(category => 
          CategoryResponseDto.fromEntity(category)
        );
      }
      return productDto;
    });

    return {
      
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        book: {
          categories: true,
          authors: true
        }
      }
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    console.log(product);

    const productDto = ProductResponseDto.fromEntity(product);
    // Add categories to the response from the book
    if (product.book && product.book.categories) {
      productDto.categories = product.book.categories.map(category => 
        CategoryResponseDto.fromEntity(category)
      );
    }

    if (product.book && product.book.authors) {
      productDto.authors = product.book.authors.map(author => 
        AuthorResponseDto.fromEntity(author)
      );
    }
    return productDto;
  }

  async hybridSearch(searchQuery: HybridSearchQueryDto): Promise<ProductResponseDto[]> {
    // For now, implement a simple text-based search
    // In a real application, this would use more sophisticated search algorithms
    const { query, limit = 10 } = searchQuery;

    const products = await this.productRepository.find({
      where: [
        { title: Like(`%${query}%`) },
        { description: Like(`%${query}%`) }
      ],
      take: limit,
      relations: ['book', 'book.categories']
    });

    return products.map(product => {
      const productDto = ProductResponseDto.fromEntity(product);
      // Add categories to the response from the book
      if (product.book && product.book.categories) {
        productDto.categories = product.book.categories.map(category => 
          CategoryResponseDto.fromEntity(category)
        );
      }

      if (product.book && product.book.authors) {
        productDto.authors = product.book.authors.map(author => 
          AuthorResponseDto.fromEntity(author)
        );
      }
      return productDto;
    });
  }

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const { title, description, descriptionSummary, price, categoryIds, authorIds } = createProductDto;

    // Create the product
    const product = this.productRepository.create({
      title,
      description,
      descriptionSummary,
      price,
    });

    // Handle authors if provided
    let bookCategories: Category[] = [];
    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.findByIds(categoryIds);
      if (categories.length !== categoryIds.length) {
        throw new BadRequestException('One or more categories not found');
      }
      bookCategories = categories;
    }

    let bookAuthors: Author[] = [];
    if (authorIds && authorIds.length > 0) {
      const authors = await this.authorRepository.findByIds(authorIds);
      if (authors.length !== authorIds.length) {
        throw new BadRequestException('One or more authors not found');
      }
      bookAuthors = authors;
    }

    // Create the book entity
    const book = this.bookRepository.create({
      fileFormat: 'PDF',
      authors: bookAuthors,
      categories: bookCategories
    });

    // Assign the book to the product
    product.book = book;

    // Save the entire product with its book relations
    const savedProduct = await this.productRepository.save(product);

    const productDto = ProductResponseDto.fromEntity(savedProduct);
    // Add categories to the response from the book
    if (savedProduct.book && savedProduct.book.categories) {
      productDto.categories = savedProduct.book.categories.map(category => 
        CategoryResponseDto.fromEntity(category)
      );
    }
    return productDto;
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['book']
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    // If the product has a book, remove it first
    if (product.book) {
      await this.bookRepository.remove(product.book);
    }

    await this.productRepository.remove(product);
  }
}