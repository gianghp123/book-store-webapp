import { Controller, Get, Post, Delete, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { CartItemResponseDto, CartResponseDto } from './dto/cart-response.dto';
import { CartService } from './cart.service';
import { Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCart(@Request() req): Promise<CartResponseDto> {
    console.log('User được gắn vào request:', req.user.id);
    return this.cartService.getCart();
  }

  @Get("/me")
  @HttpCode(HttpStatus.OK)
  async getCartByUser(@Request() req): Promise<CartResponseDto> {
    console.log('User được gắn vào request:', req.user.id);
    return this.cartService.getCartByUser(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto): Promise<CartResponseDto> {
    // TODO: Implement add an item to the cart
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async removeFromCart(@Request() req, @Body() removeFromCartDto: RemoveFromCartDto): Promise<CartItemResponseDto> {
    // TODO: Implement remove an item from the cart
    return this.cartService.removeCartItem(req.user.id, removeFromCartDto);
  }


  @Delete('clear')
  @HttpCode(HttpStatus.OK)
  async clearCart(@Request() req): Promise<CartResponseDto> {
    return this.cartService.clearCart(req.user.id);
  }
}