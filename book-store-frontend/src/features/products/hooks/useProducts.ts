import { SearchType, SortOrder } from "@/lib/constants/enums";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductFilterQueryDto } from "../dtos/request/product.dto";
import { Product } from "../dtos/response/product-response.dto";
import { getProductsAction } from "../actions/product.actions";

interface UseProductsReturn {
  products: Product[];
  total: number;
  loading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
}

export const useProducts = (): UseProductsReturn => {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Parse filters from URL
  const getFiltersFromURL = (): ProductFilterQueryDto => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 16,
      sortBy: searchParams.get("sortBy") || "id",
      sortOrder: (searchParams.get("sortOrder") as SortOrder) || SortOrder.DESC,
      query: searchParams.get("query") || "",
      categoryIds: searchParams.get("categoryIds")?.split(",").filter(Boolean) || [],
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      searchType: (searchParams.get("searchType") as SearchType) || SearchType.NORMAL,
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const filters = getFiltersFromURL();
      
      try {
        const response = await getProductsAction(filters);

        if (response.success && response.data) {
          setProducts(response.data);
          setTotal(response.pagination?.total || 0);
          setTotalPages(response.pagination?.totalPages || 0);
          setCurrentPage(response.pagination?.page || 1);
        } else {
          setError(new Error(response.message || "Failed to fetch products"));
          setProducts([]);
          setTotal(0);
        }
      } catch (err) {
        setError(err as Error);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]); // Only re-fetch when URL changes

  return {
    products,
    total,
    loading,
    error,
    currentPage,
    totalPages,
  };
};