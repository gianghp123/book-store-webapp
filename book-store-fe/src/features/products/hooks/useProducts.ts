import { useSearchContext } from "@/features/search-bar/providers/SearchContextProvider";
import { SearchType } from "@/lib/constants/enums";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductFilterQueryDto } from "../dtos/request/product.dto";
import { Product } from "../dtos/response/product-response.dto";
import { productService } from "../services/productService";

interface UseProductsReturn {
  products: Product[];
  total: number;
  loading: boolean;
  error: Error | null;
  refetch: (page?: number) => void;
  currentPage: number;
  totalPages: number;
  filters: ProductFilterQueryDto;
  setFilters: (filters: ProductFilterQueryDto) => void;
  setCurrentPage: (page: number) => void;
}

export const useProducts = (): UseProductsReturn => {
  const { searchQuery, searchType, setSearchQuery, setSearchType, setSearchInput } = useSearchContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const defaultFilters: ProductFilterQueryDto = {
    page: 1,
    limit: 16,
    sortBy: "id",
    sortOrder: "DESC",
    query: "",
    categoryIds: [],
    minPrice: undefined,
    maxPrice: undefined,
    searchType,
  };

  const getInitialFilters = (): ProductFilterQueryDto => ({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 16,
    sortBy: searchParams.get("sortBy") || "id",
    sortOrder: (searchParams.get("sortOrder") as "ASC" | "DESC") || "DESC",
    query: searchParams.get("query") || "",
    categoryIds: searchParams.get("categoryIds")?.split(",") || [],
    minPrice: Number(searchParams.get("minPrice")) || undefined,
    maxPrice: Number(searchParams.get("maxPrice")) || undefined,
    searchType: searchParams.get("searchType") as SearchType || searchType,
  });

  const [filters, setFilters] = useState<ProductFilterQueryDto>(
    getInitialFilters()
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = 
    async (page?: number) => {
      setLoading(true);
      setError(null);

      const currentPage = page || filters.page;

      try {
        const response = await productService.getProducts({
          ...filters,
          page: currentPage,
        });

        if (response.success && response.data) {
          setProducts(response.data);
          setTotal(response.pagination?.total || 0);
          setTotalPages(response.pagination?.totalPages || 0);
          // update filters.page after fetch
          setFilters((prev) => ({
            ...prev,
            page: response.pagination?.page || 1,
          }));
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
    }

  useEffect(() => {
    const hasParams = Array.from(searchParams.keys()).length > 0;
    if (!hasParams && pathname === "/") {
      setFilters(defaultFilters);
      setSearchQuery("");
      setSearchType(SearchType.NORMAL);
      setSearchInput("");
    }
  }, [pathname, searchParams]);

  // Update URL whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        (Array.isArray(value) ? value.length > 0 : true)
      ) {
        params.set(key, value.toString());
      }
    });
    router.replace(`${window.location.pathname}?${params.toString()}`);
  }, [
    filters.page,
    filters.limit,
    filters.sortBy,
    filters.sortOrder,
    filters.query,
    filters.searchType,
    router,
  ]);

  useEffect(() => {
    if (!searchQuery) return;
    setFilters((prev) => ({
      ...prev,
      query: searchQuery,
      searchType,
      page: 1,
      categoryIds: [],
      minPrice: undefined,
      maxPrice: undefined,
    }));
  }, [searchQuery]);

  useEffect(() => {
    if (!filters.query) return;

    fetchProducts(1);
  }, [filters.query]);

  useEffect(() => {
    fetchProducts();
  }, [filters.page, filters.limit, filters.sortBy, filters.sortOrder, filters.categoryIds, filters.minPrice, filters.maxPrice]);

  const setCurrentPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    // no router.replace here — URL will sync in useEffect
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
    setFilters: (newFilters) =>
      setFilters((prev) => ({ ...prev, ...newFilters })),
    setCurrentPage,
  };
};
