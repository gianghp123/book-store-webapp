import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../core/dto/pagination-query.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginatedCategoriesDto } from './dto/paginated-categories.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedCategoriesDto> {
    const { page = 1, limit = 10 } = paginationQuery;
    const offset = (page - 1) * limit;

    const [categories, total] = await this.categoryRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    const data = categories.map((category) =>
      CategoryResponseDto.fromEntity(category),
    );

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

  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return CategoryResponseDto.fromEntity(category);
  }

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // Check if category with this name already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);

    return CategoryResponseDto.fromEntity(savedCategory);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    await this.categoryRepository.remove(category);
  }
}
