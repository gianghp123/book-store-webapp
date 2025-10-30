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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { FilterPanel } from "@/features/categories/components/FilterPanel";
import { ProductFilterQueryDto } from "@/features/products/dtos/request/product.dto";
import { useProducts } from "../hooks/useProducts";
import { Filter, Grid, List } from "lucide-react";
import Link from "next/link";

// 1. CẬP NHẬT IMPORTS: Thêm useEffect và useRef
import { useEffect, useRef, useState } from "react";
// (Xóa useRouter, usePathname, useSearchParams vì không cần nữa)

import { Product } from "../dtos/response/product-response.dto";
import { ProductCard } from "./ProductCard";
import { SortDropdown, SortOption } from "./SortDropDown";
import { useSearchContext } from "@/features/search-bar/providers/SearchContextProvider";

export function ProductCatalogue() {
  const [filters, setFilters] = useState<ProductFilterQueryDto>({
    categoryIds: [],
    minPrice: 0,
    maxPrice: 1000,
  });
  
  const { searchQuery } = useSearchContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sortMapping: Record<SortOption, { field: string; order: 'ASC' | 'DESC' }> = {
    "relevance": { field: "id", order: "DESC" },
    "price-low-high": { field: "price", order: "ASC" },
    "price-high-low": { field: "price", order: "DESC" },
    "rating": { field: "rating", order: "DESC" },
    "newest": { field: "createdAt", order: "DESC" },
    "name": { field: "title", order: "ASC" },
  };

  const {
    products,
    total,
    loading,
    error,
    totalPages,
  } = useProducts({
    query: searchQuery,
    page: currentPage,
    limit: 16,
    sortBy: sortMapping[sortBy].field,
    sortOrder: sortMapping[sortBy].order,
    categoryIds: filters.categoryIds,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  });



  const [shouldSmoothScroll, setShouldSmoothScroll] = useState(false);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      return;
    }

    if (!shouldSmoothScroll) {
      return;
    }
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    setShouldSmoothScroll(false);
  }, [currentPage, shouldSmoothScroll]);

  const handlePageChange = (page: number) => {
    setShouldSmoothScroll(true);
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: ProductFilterQueryDto) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
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

  if (loading) {
    return (
      <div className="container flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex justify-center items-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex gap-6">
        <div className="hidden lg:block flex-shrink-0">
          <FilterPanel filters={filters} onFiltersChange={handleFilterChange} />
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h1>Books ({total ?? products.length})</h1>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="p-4">
                    <FilterPanel
                      filters={filters}
                      onFiltersChange={handleFilterChange}
                      isMobile={true}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <SortDropdown value={sortBy} onChange={handleSortChange} />
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No books found matching your filters.
              </p>
              <Button
                variant="outline"
                // Cập nhật nút Clear Filters
                onClick={() =>
                  handleFilterChange({
                    categoryIds: [],
                    minPrice: 0,
                    maxPrice: 1000,
                  })
                }
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div
                className={`opacity-100`}
              >
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
