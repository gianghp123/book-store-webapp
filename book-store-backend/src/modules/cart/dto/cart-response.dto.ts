import { Type } from 'class-transformer';
import { AutoExpose } from 'src/core/decorators/auto-expose.decorator';
import { BaseResponseDto } from 'src/core/dto/base.dto';
import { ProductResponseDto } from 'src/modules/product/dto/product-response.dto';
import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';
// Thêm 2 import này

@AutoExpose()
export class CartItemResponseDto extends BaseResponseDto {
  id: string;
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;
}

@AutoExpose()
export class CartResponseDto extends BaseResponseDto {
  id: string;
  @Type(() => UserResponseDto)
  user: UserResponseDto;
  // Thay đổi dòng này
  @Type(() => CartItemResponseDto) // <-- Sửa từ CartItemResponseDtoWithProduct
  items: CartItemResponseDto[]; // <-- Sửa ở đây

  createdAt: Date;
}
