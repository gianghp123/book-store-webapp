// Tệp: src/features/products/components/ProductCatalogue.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { FilterPanel } from "@/features/categories/components/FilterPanel";
import { ProductCategory } from "@/features/categories/dtos/response/category.dto";
import { ProductFilterQueryDto } from "@/features/products/dtos/request/product.dto";
import { Grid } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { SortDropdown, SortOption } from "./SortDropDown";
import { SortOrder } from "@/lib/constants/enums";
import { useRouter, useSearchParams } from "next/navigation";

export function ProductCatalogue({
  categories,
}: {
  categories: ProductCategory[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sortMapping: Record<
    SortOption,
    { field: string; order: SortOrder }
  > = {
    relevance: { field: "id", order: SortOrder.DESC },
    "price-low-high": { field: "price", order: SortOrder.ASC },
    "price-high-low": { field: "price", order: SortOrder.DESC },
    rating: { field: "rating", order: SortOrder.DESC },
    newest: { field: "createdAt", order: SortOrder.DESC },
    name: { field: "title", order: SortOrder.ASC },
  };

  const { products, total, loading, error, totalPages, currentPage } =
    useProducts();

  // Parse current filters from URL
  const getCurrentFilters = (): ProductFilterQueryDto => ({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 16,
    sortBy: searchParams.get("sortBy") || "id",
    sortOrder: (searchParams.get("sortOrder") as SortOrder) || SortOrder.DESC,
    query: searchParams.get("query") || "",
    categoryIds: searchParams.get("categoryIds")?.split(",").filter(Boolean) || [],
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    searchType: searchParams.get("searchType") as any,
  });

  const [filters, setFilters] = useState<ProductFilterQueryDto>(getCurrentFilters());

  // Sync local filters state with URL on mount and URL changes
  useEffect(() => {
    setFilters(getCurrentFilters());
  }, [searchParams]);

  // Update URL with new filters
  const updateURL = (newFilters: Partial<ProductFilterQueryDto>) => {
    const params = new URLSearchParams();
    const merged = { ...filters, ...newFilters };

    Object.entries(merged).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        (Array.isArray(value) ? value.length > 0 : true)
      ) {
        params.set(key, value.toString());
      }
    });
    if (params.toString() === searchParams.toString()) {
      return;
    }
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  const handleFilterChange = (newFilters: ProductFilterQueryDto) => {
    // Just update local state, don't update URL yet
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    // Clear filters and update URL immediately
    updateURL({
      page: 1,
      categoryIds: [],
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  const handleApplyFilters = () => {
    // Apply filters to URL (this triggers fetch via useProducts)
    updateURL({ ...filters, page: 1 });
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    const { field, order } = sortMapping[value];
    updateURL({
      page: 1,
      sortBy: field,
      sortOrder: order,
    });
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <div className="container">
      <div className="flex gap-6">
        <div className="hidden lg:block flex-shrink-0">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onApplyFilters={handleApplyFilters}
            categories={categories}
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1>Books ({total ?? products.length})</h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
              <SortDropdown value={sortBy} onChange={handleSortChange} />
            </div>
          </div>

          {loading ? (
            <div className="container flex justify-center items-center">
              <Spinner />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No books found matching your filters.
              </p>
            </div>
          ) : (
            <>
              <div className={`opacity-100`}>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
                      : "space-y-4"
                  }
                >
                  {products.map((product) => (
                    <Link href={`/products/${product.id}`} key={product.id}>
                      <ProductCard product={product} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && handlePageChange(currentPage - 1)
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {getPageNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => handlePageChange(page as number)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages &&
                          handlePageChange(currentPage + 1)
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}