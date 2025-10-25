import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ 
    description: 'Product ID to add to cart',
    type: String, 
    example: 'uuid-of-product' 
  })
  @IsUUID()
  productId: string;
}