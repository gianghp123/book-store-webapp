import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../core/dto/pagination-query.dto';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto, PaginatedOrdersDto } from './dto/order-response.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    // Find user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // Get cart items if no specific items provided in DTO
    let orderItems: OrderItem[] = [];
    if (createOrderDto.items && createOrderDto.items.length > 0) {
      // Handle "Buy now" scenario with specific items
      for (const item of createOrderDto.items) {
        const product = await this.productRepository.findOne({
          where: { id: item.productId },
        });
        if (!product) {
          throw new NotFoundException(
            `Product with ID "${item.productId}" not found`,
          );
        }
        orderItems.push(
          this.orderItemRepository.create({
            product,
            price: product.price,
          }),
        );
      }
    } else {
      // Handle cart checkout scenario
      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      if (!cart.items || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      orderItems = cart.items.map((item) =>
        this.orderItemRepository.create({
          product: item.product,
          price: item.product.price,
        }),
      );
    }

    // Calculate total amount
    const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);

    // Create order
    const newOrder = this.orderRepository.create({
      user,
      totalAmount,
      status: 'Chờ xác nhận', // Pending confirmation
    });
    const savedOrder = await this.orderRepository.save(newOrder);

    // Create order items and update product stock
    for (const item of orderItems) {
      const orderItem = this.orderItemRepository.create({
        order: savedOrder,
        product: item.product,
        price: item.price,
      });
      await this.orderItemRepository.save(orderItem);

      // Update product sold count (assuming there's a number2 field that tracks sold items)
      if (item.product['number2'] !== undefined) {
        item.product['number2'] = (item.product['number2'] || 0) + 1;
        await this.productRepository.save(item.product);
      }
    }

    // Clear cart if creating from cart items
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
      });
      if (cart) {
        await this.cartItemRepository.delete({ cart: { id: cart.id } });
      }
    }

    return OrderResponseDto.fromEntity(savedOrder);
  }

  async getOrdersByUser(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedOrdersDto> {
    const { page = 1, limit = 10 } = paginationQuery;
    const offset = (page - 1) * limit;

    const [orders, total] = await this.orderRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { orderDate: 'DESC' },
      skip: offset,
      take: limit,
    });

    const orderResponseDtos = OrderResponseDto.fromEntities(orders);

    const paginatedOrdersDto = new PaginatedOrdersDto();
    paginatedOrdersDto.data = orderResponseDtos;
    paginatedOrdersDto.pagination = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return paginatedOrdersDto;
  }

  async cancelOrder(cancelOrderDto: CancelOrderDto): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: cancelOrderDto.orderId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'Đã hủy') {
      throw new BadRequestException('Order has already been cancelled');
    }

    // Update order status
    order.status = 'Đã hủy'; // Cancelled
    await this.orderRepository.save(order);

    // Restore product stock
    for (const item of order.items) {
      if (item.product['number2'] !== undefined) {
        item.product['number2'] =
          (item.product['number2'] || 0) - item['quantity'] || 1;
        if (item.product['number2'] < 0) item.product['number2'] = 0;
        await this.productRepository.save(item.product);
      }
    }

    return OrderResponseDto.fromEntity(order);
  }

  async getAllOrders(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedOrdersDto> {
    const { page = 1, limit = 10 } = paginationQuery;
    const offset = (page - 1) * limit;

    const [orders, total] = await this.orderRepository.findAndCount({
      relations: ['items', 'items.product', 'user'],
      order: { orderDate: 'DESC' },
      skip: offset,
      take: limit,
    });

    const orderResponseDtos = OrderResponseDto.fromEntities(orders);

    const paginatedOrdersDto = new PaginatedOrdersDto();
    paginatedOrdersDto.data = orderResponseDtos;
    paginatedOrdersDto.pagination = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return paginatedOrdersDto;
  }
}
