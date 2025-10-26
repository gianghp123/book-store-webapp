import { BaseResponseDto } from 'src/core/dto/base.dto';
import { AutoExpose } from 'src/core/decorators/auto-expose.decorator';
import { capitalizeFirstLetter } from 'src/core/utils/string.util';
import { Transform } from 'class-transformer';

@AutoExpose()
export class AuthorResponseDto extends BaseResponseDto {
  id: string;
  @Transform(({ value }) => capitalizeFirstLetter(value))
  name: string;
}
