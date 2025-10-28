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
import { FilterPanel, FilterState } from "@/features/categories/components/FilterPanel"; // Import FilterState
import { HttpError, useTable } from "@refinedev/core";
import { Filter, Grid, List } from "lucide-react";
import Link from "next/link";

// 1. CẬP NHẬT IMPORTS: Thêm useEffect và useRef
import { useEffect, useState, useRef } from "react";
// (Xóa useRouter, usePathname, useSearchParams vì không cần nữa)

import { Product } from "../dtos/response/product-response.dto";
import { ProductCard } from "./ProductCard";
import { SortDropdown, SortOption } from "./SortDropDown";

// (Interface FilterState đã được import)

export function ProductCatalogue() {
  
  // 2. CẤU HÌNH useTable THEO HƯỚNG DẪN CỦA BẠN
  const {
    result,
    tableQuery,
    currentPage, // 'current' được đổi tên thành 'currentPage'
    setCurrentPage, // 'setCurrent' được đổi tên thành 'setCurrentPage'
    pageCount,
  } = useTable<Product, HttpError>({
    resource: "products",
    pagination: { pageSize: 16 },
    syncWithLocation: true,
    queryOptions: { keepPreviousData: true },
  });

  const products = result?.data;

  // State (giữ nguyên)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
  });
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 3. THÊM LOGIC CUỘN MƯỢT (THEO HƯỚNG DẪN CỦA BẠN)
  const [shouldSmoothScroll, setShouldSmoothScroll] = useState(false);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    // Tắt khôi phục scroll mặc định của trình duyệt
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Bỏ qua lần mount đầu (khi F5)
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      return;
    }
    
    // Nếu không phải do 'handlePageChange' kích hoạt -> không cuộn mượt
    if (!shouldSmoothScroll) {
      return;
    }

    // Chờ DOM render xong rồi mới cuộn mượt
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Reset state trigger
    setShouldSmoothScroll(false);
    
  }, [currentPage, shouldSmoothScroll]); // Kích hoạt khi trang thay đổi VÀ được cho phép

  
  // 4. CẬP NHẬT HÀM CHUYỂN TRANG (THEO "MẸO THÊM")
  const handlePageChange = (page: number) => {
    // Đặt state trigger -> để 'useEffect' ở trên biết là cần cuộn mượt
    setShouldSmoothScroll(true);
    // Đặt trang (Refine sẽ tự sync URL)
    setCurrentPage(page);
  };

  // 5. CẬP NHẬT HÀM FILTER/SORT (KHÔNG CUỘN MƯỢT)
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Reset về trang 1 (Refine tự sync URL)
    // KHÔNG đặt 'setShouldSmoothScroll' -> trang sẽ 'jump' lên đầu
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    // Reset về trang 1
    // KHÔNG đặt 'setShouldSmoothScroll' -> trang sẽ 'jump' lên đầu
    setCurrentPage(1);
  };


  // Generate page numbers (Không thay đổi)
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (pageCount <= maxVisiblePages) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(pageCount);
      } else if (currentPage >= pageCount - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = pageCount - 3; i <= pageCount; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(pageCount);
      }
    }
    return pages;
  };

  // Logic loading (Không thay đổi)
  // Nhờ 'keepPreviousData: true', 'isLoading' sẽ không bị true khi chuyển trang
  if (tableQuery.isLoading) {
    return (
      <div className="container flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  // RETURN JSX
  return (
    <div className="container">
      <div className="flex gap-6">
        {/* Desktop Filter Panel */}
        <div className="hidden lg:block flex-shrink-0">
          {/* Truyền hàm mới vào */}
          <FilterPanel filters={filters} onFiltersChange={handleFilterChange} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h1>Books ({result?.total ?? products.length})</h1>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="p-4">
                    {/* Truyền hàm mới vào */}
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
              {/* View Mode Toggle */}
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

              {/* Sort Dropdown */}
              {/* Truyền hàm mới vào */}
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
                    categories: [],
                    minPrice: 0,
                    maxPrice: 1000,
                    minRating: 0,
                  })
                }
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Thêm hiệu ứng mờ khi tải trang mới (isFetching) */}
              <div
                className={`transition-opacity ${
                  tableQuery.isFetching ? "opacity-70" : "opacity-100"
                }`}
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
                          currentPage < pageCount &&
                          handlePageChange(currentPage + 1)
                        }
                        className={
                          currentPage === pageCount
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