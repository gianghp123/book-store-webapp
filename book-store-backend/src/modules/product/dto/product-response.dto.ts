import { Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { AutoExpose } from 'src/core/decorators/auto-expose.decorator';
import { BaseResponseDto } from 'src/core/dto/base.dto';
import { capitalizeFirstLetter } from 'src/core/utils/string.util';
import { AuthorResponseDto } from 'src/modules/author/dto/author-response.dto';
import { CategoryResponseDto } from 'src/modules/category/dto/category-response.dto';

@AutoExpose()
export class ProductResponseDto extends BaseResponseDto {
  id: string;

  @Transform(({ value }) => (value ? capitalizeFirstLetter(value) : ''))
  title: string;

  description?: string;

  @IsOptional()
  @Transform(({ obj }) => obj.book?.imageUrl)
  imageUrl?: string;

  @IsOptional()
  @Transform(({ obj }) => obj.book?.isbn)
  isbn?: string;

  @IsOptional()
  @Transform(({ obj }) => obj.book?.publisher)
  publisher?: string;

  @IsOptional()
  @Transform(({ obj }) => obj.book?.pagesCount || 0)
  pagesCount?: number;

  price: number = 0;
  rating: number = 0;
  ratingCount: number = 0;
  createdAt: Date;
  updatedAt: Date;

  @IsOptional()
  @Type(() => CategoryResponseDto)
  @Transform(({ obj }) => CategoryResponseDto.fromEntities(obj.book?.categories))
  categories?: CategoryResponseDto[];

  @IsOptional()
  @Type(() => AuthorResponseDto)
  @Transform(({ obj }) => AuthorResponseDto.fromEntities(obj.book?.authors))
  authors?: AuthorResponseDto[];
}
