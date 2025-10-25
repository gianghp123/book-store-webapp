import { ProductResponseDto } from 'src/modules/product/dto/product-response.dto';
import { BaseResponseDto } from 'src/core/dto/base.dto';
import { AutoExpose } from 'src/core/decorators/auto-expose.decorator';
import { Type } from 'class-transformer';

@AutoExpose()
export class CartItemResponseDto extends BaseResponseDto {
  id: string;
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;
}

@AutoExpose()
export class CartResponseDto extends BaseResponseDto {
  id: string;
  @Type(() => CartItemResponseDto)
  items: CartItemResponseDto[];
  total: number;
  createdAt: Date;
}