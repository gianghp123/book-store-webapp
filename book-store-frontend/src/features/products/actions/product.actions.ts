"use server";

import { GetProductsParams } from "../services/products.service";
import { productService } from "../services/products.service";

export async function getProductsAction(params: GetProductsParams) {
  return productService.getProducts(params);
}