import { BaseResponseDto } from 'src/core/dto/base.dto';
import { AutoExpose } from 'src/core/decorators/auto-expose.decorator';

@AutoExpose()
export class CategoryResponseDto extends BaseResponseDto {
  id: string;
  name: string;
}