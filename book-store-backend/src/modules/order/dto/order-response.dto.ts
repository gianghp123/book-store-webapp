import { ProductResponseDto } from 'src/modules/product/dto/product-response.dto';
import { BaseResponseDto } from 'src/core/dto/base.dto';
import { PaginatedDto } from 'src/core/dto/paginated.dto';
import { AutoExpose } from 'src/core/decorators/auto-expose.decorator';
import { Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';

@AutoExpose()
class OrderItemResponseDto extends BaseResponseDto {
  id: string;
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;
  price: number;
}

@AutoExpose()
export class OrderResponseDto extends BaseResponseDto {
  id: string;
  user: UserResponseDto;
  orderDate: Date;
  totalAmount: number;
  status: string;
  @Type(() => OrderItemResponseDto)
  items: OrderItemResponseDto[];
}

export class PaginatedOrdersDto extends PaginatedDto<OrderResponseDto> {
}