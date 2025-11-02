// src/modules/cart/dto/cart-response.dto.ts
import { Type, Transform } from 'class-transformer'; // <-- THÊM TRANSFORM
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

  // *** THÊM TRƯỜNG TOTAL VÀO ĐÂY ***
  @Transform(({ obj }) => {
    if (!obj.items) {
      return 0;
    }
    // Tính tổng giá tiền từ các sản phẩm trong giỏ hàng
    return obj.items.reduce((acc, item) => {
      // Đảm bảo item.product.price là một số
      const price = Number(item.product?.price) || 0;
      return acc + price;
    }, 0);
  })
  total: number;
  // *** KẾT THÚC THÊM ***

  createdAt: Date;
}