import { BaseResponseDto } from 'src/core/dto/base.dto';
import { AutoExpose } from 'src/core/decorators/auto-expose.decorator';
import { Transform } from 'class-transformer';
import { capitalizeFirstLetter } from 'src/core/utils/string.util';

@AutoExpose()
export class CategoryResponseDto extends BaseResponseDto {
  id: string;
  @Transform(({ value }) => capitalizeFirstLetter(value))
  name: string;
  bookCount: number;
}
