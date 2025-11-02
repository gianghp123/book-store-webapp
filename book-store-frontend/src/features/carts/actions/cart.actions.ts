"use server";

import { AddToCartDto } from "@/features/carts/dtos/request/add-to-cart.dto";
import { RemoveFromCartDto } from "@/features/carts/dtos/request/remove-from-cart.dto";
import { cartService } from "../services/cart.service";

export async function getCartAction() {
  return cartService.getCart();
}

export async function addItemToCartAction(dto: AddToCartDto) {
  return cartService.addItemToCart(dto);
}

export async function removeItemFromCartAction(dto: RemoveFromCartDto) {
  return cartService.removeItemFromCart(dto);
}

export async function getItemsCountAction() {
  return cartService.getItemsCount();
}

export async function clearCartAction() {
  return cartService.clearCart();
}