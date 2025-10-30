import { BaseResponseDto } from 'src/core/dto/base.dto';
import { AutoExpose } from 'src/core/decorators/auto-expose.decorator';
import { Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { capitalizeFirstLetter } from 'src/core/utils/string.util';
import { ProductResponseDto } from 'src/modules/product/dto/product-response.dto';

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

  @Transform(({ obj }) => obj.product?.price)
  price: number;

  @Transform(({ obj }) => obj.product?.createdAt)
  createdAt: Date;

  @Transform(({ obj }) => obj.product?.updatedAt)
  updatedAt: Date;
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

  @Type(() => CartItemResponseDtoWithProduct)
  items: CartItemResponseDtoWithProduct[];

  createdAt: Date;
}

