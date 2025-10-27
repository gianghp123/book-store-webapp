import { Controller, Get, Post, Put, Body, Query, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/core/decorators/role.decorator';
import { Role } from 'src/core/enums/role.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { PaginatedOrdersDto } from './dto/order-response.dto';
import { OrderService } from './order.service';
import { PaginationQueryDto } from '../../core/dto/pagination-query.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/public.decorator';

@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  // @Roles(Role.ADMIN)
  @Public()
  async getAllOrders(@Query() paginationQuery: PaginationQueryDto): Promise<PaginatedOrdersDto> {
    // TODO: Implement get all orders (admin functionality)
    return this.orderService.getAllOrders(paginationQuery);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    // TODO: Implement create a new order for a user
    return this.orderService.createOrder(req.user.id, createOrderDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@Request() req, @Query() paginationQuery: PaginationQueryDto): Promise<PaginatedOrdersDto> {
    // TODO: Implement get all orders for a specific user
    return this.orderService.getOrdersByUser(req.user.id, paginationQuery);
  }

  @Put('cancel')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Body() cancelOrderDto: CancelOrderDto): Promise<OrderResponseDto> {
    // TODO: Implement cancel an order
    return this.orderService.cancelOrder(cancelOrderDto);
  }
}