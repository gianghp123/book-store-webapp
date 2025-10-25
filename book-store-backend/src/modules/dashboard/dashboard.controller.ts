import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Roles } from 'src/core/decorators/role.decorator';
import { Role } from 'src/core/enums/role.enum';
import { DashboardStatsDto, SalesOverTimeDto } from './dto/dashboard-stats.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async getStats(): Promise<DashboardStatsDto> {
    // TODO: Implement get dashboard statistics (admin functionality)
    return {} as DashboardStatsDto;
  }

  @Get('sales-over-time')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async getSalesOverTime(): Promise<SalesOverTimeDto[]> {
    // TODO: Implement get sales data over the past 7 days
    return [] as SalesOverTimeDto[];
  }
}