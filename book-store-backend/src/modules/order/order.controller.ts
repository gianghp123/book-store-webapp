import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/role.decorator';
import { Role } from 'src/core/enums/role.enum';
import { PaginationQueryDto } from '../../core/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto, PaginatedOrdersDto } from './dto/order-response.dto';
import { OrderService } from './order.service';

@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  async getAllOrders(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedOrdersDto> {
    // TODO: Implement get all orders (admin functionality)
    return this.orderService.getAllOrders(paginationQuery);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Request() req,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    // TODO: Implement create a new order for a user
    return this.orderService.createOrder(req.user.id, createOrderDto);
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getMyOrders(
    @Request() req,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedOrdersDto> {
    // TODO: Implement get all orders for a specific user
    return this.orderService.getOrdersByUser(req.user.id, paginationQuery);
  }

  @Put('cancel')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async cancelOrder(
    @Body() cancelOrderDto: CancelOrderDto,
  ): Promise<OrderResponseDto> {
    // TODO: Implement cancel an order
    return this.orderService.cancelOrder(cancelOrderDto);
  }
}
