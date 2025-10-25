import { AuthorResponseDto } from './author-response.dto';
import { PaginatedDto } from 'src/core/dto/paginated.dto';

export class PaginatedAuthorsDto extends PaginatedDto<AuthorResponseDto> {}