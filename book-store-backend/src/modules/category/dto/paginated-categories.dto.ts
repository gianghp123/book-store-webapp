import { CategoryResponseDto } from './category-response.dto';
import { PaginatedDto } from 'src/core/dto/paginated.dto';

export class PaginatedCategoriesDto extends PaginatedDto<CategoryResponseDto> {}