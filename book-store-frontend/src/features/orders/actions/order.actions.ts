"use server";

import { CreateOrderDto } from "@/features/orders/dtos/request/order.dto";
import { orderService } from "../services/orderService";

export async function createOrderAction(dto: CreateOrderDto) {
  return orderService.createOrder(dto);
}