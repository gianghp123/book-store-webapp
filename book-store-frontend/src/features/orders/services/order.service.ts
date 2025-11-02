import { apiFetch } from "@/lib/api-fetch";
import { ServerResponseModel } from "@/lib/typedefs/server-response";
import { CreateOrderDto } from "../dtos/request/order.dto";
import { OrderResponse } from "../dtos/response/order-response.dto";


const createOrder = async (
  dto: CreateOrderDto
): Promise<ServerResponseModel<OrderResponse>> => {
  const response = await apiFetch<OrderResponse>("/orders", {
    method: "POST",
    withCredentials: true,
    body: JSON.stringify(dto), 
  });
  return response;
};

export const orderService = {
  createOrder,
};