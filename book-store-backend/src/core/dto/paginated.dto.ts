import { BaseResponseDto } from './base.dto';

export class PaginatedDto<T = any> extends BaseResponseDto {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}