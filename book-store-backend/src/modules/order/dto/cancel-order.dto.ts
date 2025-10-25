import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelOrderDto {
  @ApiProperty({ 
    description: 'Order ID to cancel',
    type: String, 
    example: 'uuid-of-order' 
  })
  @IsUUID()
  orderId: string;
}