import { Controller, Get, Post, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { Roles } from 'src/core/decorators/role.decorator';
import { Role } from 'src/core/enums/role.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginationQueryDto } from 'src/core/dto/pagination-query.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { PaginatedCategoriesDto } from './dto/paginated-categories.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<PaginatedCategoriesDto> {
    return this.categoryService.findAll(paginationQuery);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoryService.create(createCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(id);
  }
}