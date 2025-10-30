"use server";

import { apiFetch } from "@/lib/api-fetch";
import { ProductCategory } from "../dtos/response/category.dto";

export async function getCategories(): Promise<ProductCategory[]> {
  try {
    const response = await apiFetch<ProductCategory[]>({
      resource: 'categories',
      pagination: {
        pageSize: 10000,
      }
    });
    
    if (response.success) {
      return response.data || [];
    } else {
      console.error("Error fetching categories:", response.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}