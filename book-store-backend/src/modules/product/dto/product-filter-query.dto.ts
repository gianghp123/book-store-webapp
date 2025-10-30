import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationQueryDto } from 'src/core/dto/pagination-query.dto';
import { SearchType } from 'src/core/enums/search-type.enum';

export class ProductFilterQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'search by query (title or description when hybrid search is enabled)',
    type: String,
  })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({
    description: 'filter by category ids',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return [];
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({
    description: 'filter by min price',
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'filter by max price',
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'search type',
    enum: SearchType,
  })
  @IsOptional()
  @IsEnum(SearchType)
  searchType?: SearchType = SearchType.NORMAL;
}
