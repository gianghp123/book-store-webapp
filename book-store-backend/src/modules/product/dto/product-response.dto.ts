import { CategoryResponseDto } from 'src/modules/category/dto/category-response.dto';
import { BaseResponseDto } from 'src/core/dto/base.dto';
import { AutoExpose } from 'src/core/decorators/auto-expose.decorator';
import { Type } from 'class-transformer';
import { AuthorResponseDto } from 'src/modules/author/dto/author-response.dto';
import { IsOptional } from 'class-validator';

@AutoExpose()
export class ProductResponseDto extends BaseResponseDto {
  id: string;
  title: string;
  description?: string;
  price: number;
  rating: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
  @IsOptional()
  @Type(() => CategoryResponseDto)
  categories?: CategoryResponseDto[];
  @IsOptional()
  @Type(() => AuthorResponseDto)
  authors?: AuthorResponseDto[];
}