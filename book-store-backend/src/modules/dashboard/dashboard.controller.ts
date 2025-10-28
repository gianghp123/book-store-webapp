// src/modules/dashboard/dashboard.controller.ts
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Roles } from 'src/core/decorators/role.decorator';
import { Role } from 'src/core/enums/role.enum';
import { DashboardStatsDto, SalesOverTimeDto, CategorySalesDto } from './dto/dashboard-stats.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async getStats(): Promise<DashboardStatsDto> {
    return this.dashboardService.getDashboardStats();
  }

  @Get('sales-over-time')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async getSalesOverTime(): Promise<SalesOverTimeDto[]> {
    return this.dashboardService.getSalesOverTime();
  }

  @Get('sales-by-category')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async getSalesByCategory(): Promise<CategorySalesDto[]> { 
    return this.dashboardService.getSalesByCategory(); 
  }
}