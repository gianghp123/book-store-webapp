import { useState, useEffect } from "react";
import { Product } from "../dtos/response/product-response.dto";
import { ProductFilterQueryDto } from "../dtos/request/product.dto";
import { productService } from "../services/productService";
import { ServerResponseModel } from "@/lib/typedefs/server-response";

interface UseProductsReturn {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  currentPage: number;
  totalPages: number;
}

export const useProducts = (params: ProductFilterQueryDto): UseProductsReturn => {
  const {
    query: searchQuery,
    page,
    limit = 16,
    sortBy = 'id',
    sortOrder = 'DESC',
    categoryIds,
    minPrice,
    maxPrice,
  } = params;

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await productService.getProducts({
        ...params,
        ...(searchQuery && { title: searchQuery }), // Add search query as title filter
        page,
        limit,
        sortBy,
        sortOrder,
      });

      if (response.success && response.data) {
        setProducts(response.data.data || []);
        setTotal(response.data.total || 0);
        setCurrentPage(response.data.page || 1);
        setTotalPages(response.data.totalPages || 0);
      } else {
        setError(response.message || "Failed to fetch products");
        setProducts([]);
        setTotal(0);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching products");
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    categoryIds?.join(','),
    minPrice,
    maxPrice,
    searchQuery,
    page,
    limit,
    sortBy,
    sortOrder
  ]);

  return {
    products,
    total,
    loading,
    error,
    refetch: fetchProducts,
    currentPage,
    totalPages,
  };
};