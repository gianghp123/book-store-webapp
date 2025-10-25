import { BaseResponseDto } from 'src/core/dto/base.dto';

export class DashboardStatsDto extends BaseResponseDto {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export class SalesOverTimeDto extends BaseResponseDto {
  date: string;
  sales: number;
}