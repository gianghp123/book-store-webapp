import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/public.decorator';
import { Roles } from 'src/core/decorators/role.decorator';
import { Role } from 'src/core/enums/role.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { ProductFilterQueryDto } from './dto/product-filter-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductService } from './product.service';

@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() filterQuery: ProductFilterQueryDto,
  ): Promise<PaginatedProductsDto> {
    return this.productService.findAll(filterQuery);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.create(createProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
