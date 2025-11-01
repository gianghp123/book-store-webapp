import { Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { AutoExpose } from 'src/core/decorators/auto-expose.decorator';
import { BaseResponseDto } from 'src/core/dto/base.dto';
import { PaginatedDto } from 'src/core/dto/paginated.dto';
import { OrderStatus } from 'src/core/enums/order-status.enum';
import { ProductResponseDto } from 'src/modules/product/dto/product-response.dto';
import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';

@AutoExpose()
class OrderItemResponseDto extends BaseResponseDto {
  id: string;
  price: number;
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;
}

@AutoExpose()
export class OrderResponseDto extends BaseResponseDto {
  id: string;
  user: UserResponseDto;
  orderDate: Date;
  totalAmount: number;
  @IsEnum(OrderStatus)
  status: OrderStatus;
  @Type(() => OrderItemResponseDto)
  items: OrderItemResponseDto[];
}

export class PaginatedOrdersDto extends PaginatedDto<OrderResponseDto> {}
