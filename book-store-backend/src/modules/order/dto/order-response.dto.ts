import { ProductResponseDto } from 'src/modules/product/dto/product-response.dto';
import { BaseResponseDto } from 'src/core/dto/base.dto';
import { PaginatedDto } from 'src/core/dto/paginated.dto';
import { AutoExpose } from 'src/core/decorators/auto-expose.decorator';
import { Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { capitalizeFirstLetter } from 'src/core/utils/string.util';

@AutoExpose()
class OrderItemResponseDto extends BaseResponseDto {
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
  
  @IsOptional()
    @Transform(({ obj }) => obj.product?.book?.fileUrl)
  fileUrl?: string;

  @Transform(({ obj }) => obj.product?.createdAt)
  createdAt: Date;

  @Transform(({ obj }) => obj.product?.updatedAt)
  updatedAt: Date;
}

@AutoExpose()
export class OrderResponseDto extends BaseResponseDto {
  id: string;
  userId: string;
  orderDate: Date;
  totalAmount: number;
  status: string;
  @Type(() => OrderItemResponseDto)
  items: OrderItemResponseDto[];
}

export class PaginatedOrdersDto extends PaginatedDto<OrderResponseDto> {
}