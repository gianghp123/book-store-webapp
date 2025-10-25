import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartItemResponseDto, CartResponseDto } from './dto/cart-response.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    // Find or create user's cart
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!cart) {
      // Create a new cart for the user
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID "${userId}" not found`);
      }
      cart = this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
    }

    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: addToCartDto.productId },
    });
    if (!product) {
      throw new NotFoundException(
        `Product with ID "${addToCartDto.productId}" not found`,
      );
    }

    // Check if item already exists in cart (for e-book store, one copy per cart)
    const existingItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: product.id },
      },
    });

    if (existingItem) {
      throw new BadRequestException('Product already exists in cart');
    } else {
      // Add item to cart (quantity is always 1 for e-books)
      const cartItem = this.cartItemRepository.create({
        cart,
        product,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return CartResponseDto.fromEntity(cart);
  }

  async getCartByUser(userId: string): Promise<CartResponseDto> {
    // Find user's cart
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'items.product.book'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return CartResponseDto.fromEntity(cart);
  }

  async removeCartItem(
    userId: string,
    removeFromCartDto: RemoveFromCartDto,
  ): Promise<CartItemResponseDto> {
    // Find user's cart
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Find the cart item to remove
    const item = await this.cartItemRepository.findOne({
      where: {
        product: { id: removeFromCartDto.productId },
        cart: { id: cart.id },
      },
    });

    if (!item) {
      throw new NotFoundException('Product not found in cart');
    }

    await this.cartItemRepository.remove(item);

    return CartItemResponseDto.fromEntity(item);
  }

  async clearCart(userId: string): Promise<CartResponseDto> {
    // Find user's cart
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Remove all cart items
    if (cart.items && cart.items.length > 0) {
      await this.cartItemRepository.delete({ cart: { id: cart.id } });
    }

    return CartResponseDto.fromEntity(cart);
  }
}
