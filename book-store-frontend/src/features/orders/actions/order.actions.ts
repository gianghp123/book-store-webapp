"use server";

import { CreateOrderDto } from "@/features/orders/dtos/request/order.dto";
import { orderService } from "../services/order.Service";

export async function createOrderAction(dto: CreateOrderDto) {
  return orderService.createOrder(dto);
}