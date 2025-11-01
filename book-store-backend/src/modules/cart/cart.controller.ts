import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/role.decorator';
import { Role } from 'src/core/enums/role.enum';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartItemResponseDto, CartResponseDto } from './dto/cart-response.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@ApiBearerAuth()
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getCarts(): Promise<CartResponseDto[]> {
    return this.cartService.getCarts();
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getCartByUser(@Request() req): Promise<CartResponseDto> {
    return this.cartService.getCartByUser(req.user.id);
  }

  @Get('/items-count')
  @HttpCode(HttpStatus.OK)
  async getCartItemCountByUser(@Request() req): Promise<number> {
    return this.cartService.getCartItemCountByUser(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async addToCart(
    @Request() req,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    // TODO: Implement add an item to the cart
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async removeFromCart(
    @Request() req,
    @Body() removeFromCartDto: RemoveFromCartDto,
  ): Promise<CartItemResponseDto> {
    // TODO: Implement remove an item from the cart
    return this.cartService.removeCartItem(req.user.id, removeFromCartDto);
  }

  @Delete('clear')
  @HttpCode(HttpStatus.OK)
  async clearCart(@Request() req): Promise<CartResponseDto> {
    return this.cartService.clearCart(req.user.id);
  }
}
