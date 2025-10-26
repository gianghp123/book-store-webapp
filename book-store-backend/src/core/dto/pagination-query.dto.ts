import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from '../enums/sort.enum';

export class PaginationQueryDto {
  @ApiPropertyOptional({ 
    description: 'Page number for pagination',
    type: Number, 
    example: 1,
    default: 1
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    type: Number,
    example: 10,
    default: 10
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number = 10;

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