import { IsOptional, IsString, IsNumber, IsArray, IsUUID, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from 'src/core/dto/pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger'; 
import { SortOrder } from 'src/core/enums/sort.enum';

export class ProductFilterQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ 
      description: 'search by title',
      type: String, 
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'filter by category ids',
    type: [String],
  })
  @IsOptional()
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
    description: 'sort by field',
    type: String,
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'sort order',
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}