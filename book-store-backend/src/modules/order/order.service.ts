// src/modules/order/order.service.ts
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
  ) { }

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!createOrderDto.items?.length) {
      throw new BadRequestException("Order must include at least one item.");
    }

    const existingOrderItems = await this.orderItemRepository.find({
      where: { order: { user: { id: userId } } },
      relations: ['product'],
    });

    const existedProductIds = new Set(existingOrderItems.map(i => i.product.id));

    const orderItems: OrderItem[] = [];

    for (const item of createOrderDto.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (existedProductIds.has(product.id)) {
        throw new BadRequestException(
          `Sản phẩm "${product.title}" đã nằm trong đơn hàng trước đó, không thể đặt lại.`
        );
      }

      // *** BẮT ĐẦU SỬA LỖI ***
      // Ép kiểu product.price (string) thành Number
      const itemPrice = Number(product.price);
      
      orderItems.push(
        this.orderItemRepository.create({
          product,
          price: itemPrice, // <-- Sử dụng giá đã ép kiểu
        }),
      );
      // *** KẾT THÚC SỬA LỖI ***
    }

    // Bây giờ i.price đã là Number, phép tính tổng sẽ đúng
    const totalAmount = orderItems.reduce((sum, i) => sum + i.price, 0);

    const order = this.orderRepository.create({
      user,
      totalAmount, // totalAmount bây giờ là Number
      status: 'Success',
    });
    // Dòng này (trước đây là 92) sẽ chạy đúng
    await this.orderRepository.save(order);

    orderItems.forEach(i => (i.order = order));
    await this.orderItemRepository.save(orderItems);

    if (cart && cart.items?.length > 0) {
      const productIds = orderItems.map(i => i.product.id);

      const itemsToRemove = cart.items.filter(ci =>
        productIds.includes(ci.product.id)
      );

      if (itemsToRemove.length > 0) {
        await this.cartItemRepository.remove(itemsToRemove);
      }
    }

    // Tải lại đơn hàng để có 'items' và 'user'
    const completeOrder = await this.orderRepository.findOne({
      where: { id: order.id },
      relations: [
        'items', 
        'items.product', 
        'items.product.book', 
        'user'
      ],
    });

    if (!completeOrder) {
      throw new NotFoundException('Đơn hàng đã được tạo nhưng không thể tải lại.');
    }

    return OrderResponseDto.fromEntity(completeOrder);
  }

  async getOrdersByUser(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedOrdersDto> {
    const { page = 1, limit = 10 } = paginationQuery;
    const offset = (page - 1) * limit;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'items.product.book'],
      order: { orderDate: 'DESC' },
      skip: offset,
      take: limit,
    });

    if (orders.length === 0) {
      throw new NotFoundException('User has no orders');
    }

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