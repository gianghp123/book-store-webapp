import { BaseResponseDto } from 'src/core/dto/base.dto';
import { AutoExpose } from 'src/core/decorators/auto-expose.decorator';
import { Transform, Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';
import { IsOptional } from 'class-validator';
import { capitalizeFirstLetter } from 'src/core/utils/string.util';
import { ProductResponseDto } from 'src/modules/product/dto/product-response.dto';
// Thêm 2 import này
import { CategoryResponseDto } from 'src/modules/category/dto/category-response.dto';
import { AuthorResponseDto } from 'src/modules/author/dto/author-response.dto';

@AutoExpose()
export class CartItemResponseDto extends BaseResponseDto {
  id: string;

  @Transform(({ obj }) => obj.product?.id)
  productId: string;

  @Transform(({ obj }) => {
    const title = obj.product?.title;
    return title ? capitalizeFirstLetter(title) : '';
  })
  title: string;

  @IsOptional()
  @Transform(({ obj }) => obj.product?.book?.imageUrl)
  imageUrl?: string;

  // Thêm ISBN
  @IsOptional()
  @Transform(({ obj }) => obj.product?.book?.isbn)
  isbn?: string;

  @Transform(({ obj }) => obj.product?.price)
  price: number;

  @Transform(({ obj }) => obj.product?.createdAt)
  createdAt: Date;

  // Xóa updatedAt
  // @Transform(({ obj }) => obj.product?.updatedAt)
  // updatedAt: Date;

  // Thêm Categories
  @IsOptional()
  @Type(() => CategoryResponseDto)
  @Transform(({ obj }) => CategoryResponseDto.fromEntities(obj.product?.book?.categories))
  categories?: CategoryResponseDto[];

  // Thêm Authors
  @IsOptional()
  @Type(() => AuthorResponseDto)
  @Transform(({ obj }) => AuthorResponseDto.fromEntities(obj.product?.book?.authors))
  authors?: AuthorResponseDto[];
}

@AutoExpose()
export class CartItemResponseDtoWithProduct extends BaseResponseDto {
  id: string;
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;
}

@AutoExpose()
export class CartResponseDto extends BaseResponseDto {
  id: string;

  // Thay đổi dòng này
  @Type(() => CartItemResponseDto) // <-- Sửa từ CartItemResponseDtoWithProduct
  items: CartItemResponseDto[]; // <-- Sửa ở đây

  createdAt: Date;
}