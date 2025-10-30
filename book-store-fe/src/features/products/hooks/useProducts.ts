import { useEffect, useState } from "react";
import { ProductFilterQueryDto } from "../dtos/request/product.dto";
import { Product } from "../dtos/response/product-response.dto";
import { productService } from "../services/productService";
import { useSearchContext } from "@/features/search-bar/providers/SearchContextProvider";

interface UseProductsReturn {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: (page?: number) => void;
  currentPage: number;
  totalPages: number;
  filters: ProductFilterQueryDto;
  setFilters: (filters: ProductFilterQueryDto) => void;
  setCurrentPage: (page: number) => void;
}

export const useProducts = (): UseProductsReturn => {
  const { searchQuery } = useSearchContext();
  const [filters, setFilters] = useState<ProductFilterQueryDto>({ page: 1, limit: 16, sortBy: "id", sortOrder: "DESC" });
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  
  useEffect(() => {
    setFilters({ ...filters, query: searchQuery });
  }, [searchQuery]);

  const fetchProducts = async (page?: number) => {
    setLoading(true);
    setError(null);

    try {
      console.log(filters);
      const response = await productService.getProducts({
        ...filters,
        page: page || filters.page,
        limit: 16,
        sortBy: "id",
        sortOrder: "DESC",
      });

      if (response.success && response.data) {
        setProducts(response.data || []);
        setTotal(response.pagination?.total || 0);
        setFilters({ ...filters, page: response.pagination?.page || 1 });
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
  }, [filters.page, filters.limit, filters.sortBy, filters.sortOrder]);

  const setCurrentPage = (page: number) => {
    setFilters({ ...filters, page });
  };

  return {
    products,
    total,
    loading,
    error,
    refetch: fetchProducts,
    currentPage: filters.page || 1,
    totalPages,
    filters,
    setFilters,
    setCurrentPage,
  };
};
