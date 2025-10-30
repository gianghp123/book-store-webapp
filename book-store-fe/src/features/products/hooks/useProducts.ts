import { useEffect, useState } from "react";
import { ProductFilterQueryDto } from "../dtos/request/product.dto";
import { Product } from "../dtos/response/product-response.dto";
import { productService } from "../services/productService";

interface UseProductsReturn {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  currentPage: number;
  totalPages: number;
}

export const useProducts = (
  params: ProductFilterQueryDto
): UseProductsReturn => {
  const { page, limit = 16, sortBy = "id", sortOrder = "DESC" } = params;

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
        page,
        limit,
        sortBy,
        sortOrder,
      });

      if (response.success && response.data) {
        setProducts(response.data || []);
        setTotal(response.pagination?.total || 0);
        setCurrentPage(response.pagination?.page || 1);
        setTotalPages(response.pagination?.totalPages || 0);
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
  }, [page, limit, sortBy, sortOrder]);

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
