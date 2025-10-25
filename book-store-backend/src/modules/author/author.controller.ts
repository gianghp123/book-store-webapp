import { Controller, Get, Post, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { Roles } from 'src/core/decorators/role.decorator';
import { Role } from 'src/core/enums/role.enum';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { AuthorResponseDto } from './dto/author-response.dto';
import { PaginatedAuthorsDto } from './dto/paginated-authors.dto';
import { PaginationQueryDto } from '../../core/dto/pagination-query.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<PaginatedAuthorsDto> {
    return this.authorService.findAll(paginationQuery);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<AuthorResponseDto> {
    return this.authorService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  async create(@Body() createAuthorDto: CreateAuthorDto): Promise<AuthorResponseDto> {
    return this.authorService.create(createAuthorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    return this.authorService.remove(id);
  }
}