import { apiFetch } from "@/lib/api-fetch";
import { ProductFilterQueryDto } from "../dtos/request/product.dto";
import { Product } from "../dtos/response/product-response.dto";

interface GetProductsParams extends ProductFilterQueryDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export const productService = {
  getProducts: async (params: GetProductsParams) => {
    return apiFetch<Product[]>("/products", {
      query: {
        ...params,
        page: params.page || 1,
        limit: params.limit || 16,
      },
    });
  },
};
