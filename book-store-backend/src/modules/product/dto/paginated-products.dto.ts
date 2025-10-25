import { ProductResponseDto } from './product-response.dto';
import { PaginatedDto } from 'src/core/dto/paginated.dto';

export class PaginatedProductsDto extends PaginatedDto<ProductResponseDto> {}