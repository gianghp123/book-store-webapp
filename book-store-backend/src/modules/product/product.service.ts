import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  Query,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { SearchType } from 'src/core/enums/search-type.enum';
import {
  HybridBookRetrieverService,
  RetrieveRequest,
} from 'src/protos/retriever.service.interface';
import { In, Repository } from 'typeorm';
import { Author } from '../author/entities/author.entity';
import { CategoryResponseDto } from '../category/dto/category-response.dto';
import { Category } from '../category/entities/category.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { HybridSearchQueryDto } from './dto/hybrid-search-query.dto';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { ProductFilterQueryDto } from './dto/product-filter-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Book } from './entities/book.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService implements OnModuleInit {
  private retrieverService: HybridBookRetrieverService;

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    @Inject('SEARCH_ENGINE_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.retrieverService = this.client.getService<HybridBookRetrieverService>(
      'HybridBookRetriever',
    );
  }

  async findAll(
    @Query() filterQuery: ProductFilterQueryDto,
  ): Promise<PaginatedProductsDto> {
    const {
      page = 1,
      limit = 10,
      query,
      categoryIds,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      searchType,
    } = filterQuery;

    const offset = (page - 1) * limit;

    if (searchType === SearchType.SMART && query) {
      return this.hybridSearch({ query: query!, page, limit });
    }

    // ✅ Step 1: Build subquery to select product IDs
    const subQuery = this.productRepository
      .createQueryBuilder('product')
      .select('product.id')
      .leftJoin('product.book', 'book');

    if (query) {
      subQuery.andWhere('product.title ILIKE :query', { query: `%${query}%` });
    }

    if (minPrice !== undefined) {
      subQuery.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      subQuery.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // ✅ Only join categories if the user actually filters by them
    if (categoryIds && categoryIds.length > 0) {
      subQuery
        .leftJoin('book.categories', 'categories')
        .andWhere('categories.id IN (:...categoryIds)', { categoryIds });
    }

    // ✅ Sorting
    if (sortBy) {
      const direction = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      subQuery.orderBy(`product.${sortBy}`, direction);
    } else {
      subQuery.orderBy('product.createdAt', 'DESC');
    }

    // ✅ Step 2: Get total count from subquery
    const total = await subQuery.getCount();

    // ✅ Step 3: Paginate IDs only
    const ids = await subQuery.offset(offset).limit(limit).getRawMany();

    if (ids.length === 0) {
      return {
        data: [],
        pagination: { total, page, limit, totalPages: 0 },
      };
    }

    const productIds = ids.map((r) => r.product_id ?? r.id);

    // ✅ Step 4: Load full entities with relations
    const products = await this.productRepository.find({
      where: { id: In(productIds) },
      relations: ['book', 'book.categories', 'book.authors'],
      order: { createdAt: 'DESC' },
    });

    // ✅ Step 5: Transform into DTOs
    const data = ProductResponseDto.fromEntities(products);

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
          authors: true,
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    const productExistOrder = await this.orderItemRepository.findOne({
      where: {
        product: { id },
      },
    });

    const productDto = ProductResponseDto.fromEntity(product);

    if (product.book) {
      productDto.imageUrl = product.book.imageUrl;

      if (productExistOrder! || productExistOrder == null) {
        productDto.fileUrl = undefined;
      }
    }

    return productDto;
  }

  async hybridSearch(
    searchQuery: HybridSearchQueryDto,
  ): Promise<PaginatedProductsDto> {
    const { query, page = 1, limit = 12 } = searchQuery;
    const offset = (page - 1) * limit;

    if (!query) {
      throw new BadRequestException('Missing required parameter: query');
    }

    // 🔹 Step 1: Call gRPC retriever service and await response
    const grpcRequest: RetrieveRequest = {
      query,
      denseTopK: 500,
      sparseTopK: 500,
      topK: 100,
      topN: 50,
    };

    const retrievedBooks = await firstValueFrom(
      this.retrieverService.Retrieve(grpcRequest),
    );

    if (!retrievedBooks?.bookIds?.length) {
      return {
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
        data: [],
      };
    }

    // 🔹 Step 2: Apply pagination to the list of book IDs
    const paginatedBookIds = retrievedBooks.bookIds.slice(
      offset,
      offset + limit,
    );

    // 🔹 Step 3: Query database using TypeORM
    const products = await this.productRepository.find({
      where: {
        book: { id: In(paginatedBookIds) },
      },
      relations: ['book', 'book.categories', 'book.authors'],
    });

    // 🔹 Step 4: Map scores for sorting
    const scoreMap = Object.fromEntries(
      retrievedBooks.bookIds.map((id, i) => [
        id,
        retrievedBooks.scores[i] ?? 0,
      ]),
    );

    const sortedProducts = products.sort((a, b) => {
      const scoreA = scoreMap[a.book?.id] ?? 0;
      const scoreB = scoreMap[b.book?.id] ?? 0;
      return scoreB - scoreA;
    });

    // 🔹 Step 5: Map to your DTO
    const productDtos: ProductResponseDto[] =
      ProductResponseDto.fromEntities(sortedProducts);
    // ✅ Step 6: Return paginated response
    return {
      pagination: {
        total: 50,
        page,
        limit,
        totalPages: Math.ceil(50 / limit),
      },
      data: productDtos,
    };
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const {
      title,
      description,
      descriptionSummary,
      price,
      categoryIds,
      authorIds,
    } = createProductDto;

    const product = this.productRepository.create({
      title,
      description,
      descriptionSummary,
      price,
    });

    let bookCategories: Category[] = [];
    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });
      if (categories.length !== categoryIds.length) {
        throw new BadRequestException('One or more categories not found');
      }
      bookCategories = categories;
    }

    let bookAuthors: Author[] = [];
    if (authorIds && authorIds.length > 0) {
      const authors = await this.authorRepository.find({
        where: { id: In(authorIds) },
      });
      if (authors.length !== authorIds.length) {
        throw new BadRequestException('One or more authors not found');
      }
      bookAuthors = authors;
    }

    // Create the book entity
    const book = this.bookRepository.create({
      fileFormat: 'PDF',
      authors: bookAuthors,
      categories: bookCategories,
    });

    // Assign the book to the product
    product.book = book;

    // Save the entire product with its book relations
    const savedProduct = await this.productRepository.save(product);

    const productDto = ProductResponseDto.fromEntity(savedProduct);
    // Add categories to the response from the book
    if (savedProduct.book && savedProduct.book.categories) {
      productDto.categories = savedProduct.book.categories.map((category) =>
        CategoryResponseDto.fromEntity(category),
      );
    }
    return productDto;
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['book'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    if (product.book) {
      await this.bookRepository.remove(product.book);
    }

    await this.productRepository.remove(product);
  }
}
