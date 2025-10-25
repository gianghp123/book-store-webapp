import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ 
    description: 'Title of the product',
    type: String, 
    example: 'Sách giáo trình Toán' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Full description of the product',
    type: String,
    example: 'Sách giáo trình Toán lớp 12 với nhiều bài tập mẫu...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Summary of the product description',
    type: String,
    example: 'Sách Toán lớp 12',
  })
  @IsString()
  @IsOptional()
  descriptionSummary?: string;

  @ApiProperty({ 
    description: 'Price of the product',
    type: Number, 
    example: 50000,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Array of category IDs',
    type: [String],
    example: ['uuid-1', 'uuid-2'],
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  categoryIds?: string[];

  @ApiPropertyOptional({
    description: 'Array of author IDs',
    type: [String],
    example: ['uuid-author-1', 'uuid-author-2'],
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  authorIds?: string[];
}