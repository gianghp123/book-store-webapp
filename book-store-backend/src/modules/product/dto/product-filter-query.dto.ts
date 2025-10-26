import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationQueryDto } from 'src/core/dto/pagination-query.dto';

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
}
