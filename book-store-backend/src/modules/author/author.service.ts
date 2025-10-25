import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../core/dto/pagination-query.dto'; // Reusing from category module
import { AuthorResponseDto } from './dto/author-response.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { PaginatedAuthorsDto } from './dto/paginated-authors.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedAuthorsDto> {
    const { page = 1, limit = 10 } = paginationQuery;
    const offset = (page - 1) * limit;

    const [authors, total] = await this.authorRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    const data = authors.map((author) => AuthorResponseDto.fromEntity(author));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<AuthorResponseDto> {
    const author = await this.authorRepository.findOne({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException(`Author with ID "${id}" not found`);
    }

    return AuthorResponseDto.fromEntity(author);
  }

  async create(createAuthorDto: CreateAuthorDto): Promise<AuthorResponseDto> {
    // Check if author with this name already exists
    const existingAuthor = await this.authorRepository.findOne({
      where: { name: createAuthorDto.name },
    });
    if (existingAuthor) {
      throw new BadRequestException('Author with this name already exists');
    }

    const author = this.authorRepository.create(createAuthorDto);
    const savedAuthor = await this.authorRepository.save(author);

    return AuthorResponseDto.fromEntity(savedAuthor);
  }

  async remove(id: string): Promise<void> {
    const author = await this.authorRepository.findOne({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException(`Author with ID "${id}" not found`);
    }

    await this.authorRepository.remove(author);
  }
}
