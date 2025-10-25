import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ 
    description: 'Name of the category',
    type: String, 
    example: 'Giáo trình' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}