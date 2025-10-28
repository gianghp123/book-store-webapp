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
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    let orderItems: OrderItem[] = [];
    let isFromCart = false;
    let cart: Cart | null = null;

    if (createOrderDto.items && createOrderDto.items.length > 0) {
      for (const item of createOrderDto.items) {
        const product = await this.productRepository.findOne({
          where: { id: item.productId },
          relations: ['book'],
        });

        if (!product) {
          throw new NotFoundException(`Product with ID "${item.productId}" not found`);
        }

        orderItems.push(
          this.orderItemRepository.create({
            product,
            price: product.price,
          }),
        );
      }
    } else {
      isFromCart = true;

      cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });

      if (!cart) throw new NotFoundException('Cart not found');
      if (!cart.items || cart.items.length === 0)
        throw new BadRequestException('Cart is empty');

      orderItems = cart.items.map((item) =>
        this.orderItemRepository.create({
          product: item.product,
          price: item.product.price,
        }),
      );
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);

    const newOrder = this.orderRepository.create({
      user,
      totalAmount,
      status: 'Success',
    });
    const savedOrder = await this.orderRepository.save(newOrder);

    for (const item of orderItems) {
      await this.orderItemRepository.save({
        order: savedOrder,
        product: item.product,
        price: item.price,
      });
    }

    console.log(isFromCart, cart)

    if (isFromCart && cart) {
      for (const orderItem of orderItems) {
        console.log('OrderItem:', orderItem.product.id);
        const cartItem = await this.cartItemRepository.findOne({
          where: {
            product: { id: orderItem.product.id },
            cart: { id: cart.id },
          },
        });

        if (cartItem) {
          await this.cartItemRepository.remove(cartItem);
        }
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
