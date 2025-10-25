import { IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ 
    description: 'Product ID for the order item',
    type: String, 
    example: 'uuid-of-product' 
  })
  @IsUUID()
  productId: string;
}

export class CreateOrderDto {
  @ApiProperty({ 
    description: 'Array of order items',
    type: [OrderItemDto],
    example: [
      { 
        productId: 'uuid-of-product'
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ 
    description: 'Cart ID to create order from',
    type: String, 
    example: 'uuid-of-cart' 
  })
  @IsUUID()
  cartId: string;
}