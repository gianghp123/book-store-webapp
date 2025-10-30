import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class HybridSearchQueryDto {
  @ApiProperty({ 
    description: 'Search query string',
    type: String, 
    example: 'Classic children\'s stories featuring Winnie-the-Pooh and friends' 
  })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results to return',
    type: Number,
    example: 10,
  })
  @Type(() => Number)
  @IsOptional() 
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Page number',
    type: Number,
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  page?: number;
}