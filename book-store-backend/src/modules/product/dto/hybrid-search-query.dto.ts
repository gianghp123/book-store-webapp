import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HybridSearchQueryDto {
  @ApiProperty({ 
    description: 'Search query string',
    type: String, 
    example: 'Sách giáo trình' 
  })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results to return',
    type: Number,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;
}