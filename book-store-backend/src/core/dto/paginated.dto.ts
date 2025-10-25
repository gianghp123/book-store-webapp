import { BaseResponseDto } from './base.dto';

export class PaginatedDto<T = any> extends BaseResponseDto {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}