import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveFromCartDto {
  @ApiProperty({ 
    description: 'Product ID to remove from cart',
    type: String, 
    example: 'uuid-of-product' 
  })
  @IsUUID()
  productId: string;
}