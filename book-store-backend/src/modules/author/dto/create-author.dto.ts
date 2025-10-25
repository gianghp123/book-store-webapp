import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ 
    description: 'Name of the author',
    type: String, 
    example: 'Nguyen Nhat Anh' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}