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
import { FilterPanel } from "@/features/categories/components/FilterPanel";
import { Filter, Grid, List } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { SortDropdown, SortOption } from "./SortDropDown";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  salePercentage?: number;
}

interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

// Mock book data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "The Midnight Library",
    price: 24.99,
    rating: 4.5,
    reviewCount: 1284,
    image:
      "https://images.unsplash.com/photo-1661936901394-a993c79303c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXJzJTIwZmljdGlvbnxlbnwxfHx8fDE3NjEzODcyMzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "fiction",
  },
  {
    id: "2",
    name: "Pride and Prejudice",
    price: 12.99,
    rating: 4.8,
    reviewCount: 3456,
    image:
      "https://images.unsplash.com/photo-1761319115156-d758b22ed57b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwbGl0ZXJhdHVyZSUyMGJvb2tzfGVufDF8fHx8MTc2MTM4ODcwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "classics",
  },
  {
    id: "3",
    name: "Gone Girl",
    price: 18.5,
    rating: 4.2,
    reviewCount: 2187,
    image:
      "https://images.unsplash.com/photo-1698954634383-eba274a1b1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwdGhyaWxsZXIlMjBib29rc3xlbnwxfHx8fDE3NjEzOTY3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "mystery",
  },
  {
    id: "4",
    name: "Dune",
    price: 22.0,
    originalPrice: 28.0,
    rating: 4.7,
    reviewCount: 1892,
    image:
      "https://images.unsplash.com/photo-1758655212547-0f4f8554ddd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMGJvb2tzfGVufDF8fHx8MTc2MTM5Njc5MXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "scifi",
  },
  {
    id: "5",
    name: "The Hobbit",
    price: 16.99,
    rating: 4.9,
    reviewCount: 4523,
    image:
      "https://images.unsplash.com/photo-1607806495948-1e5fb00689a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYm9va3MlMjBzdGFja3xlbnwxfHx8fDE3NjEzOTY3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "fantasy",
  },
  {
    id: "6",
    name: "Steve Jobs",
    price: 32.0,
    rating: 4.6,
    reviewCount: 987,
    image:
      "https://images.unsplash.com/photo-1729569297607-c65f976471c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9ncmFwaHklMjBib29rcyUyMHNoZWxmfGVufDF8fHx8MTc2MTM5Njc5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "biography",
  },
  {
    id: "7",
    name: "Atomic Habits",
    price: 27.0,
    originalPrice: 34.0,
    rating: 4.8,
    reviewCount: 2341,
    image:
      "https://images.unsplash.com/photo-1610902954914-a74e5e35acef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGJvb2tzJTIwZGVza3xlbnwxfHx8fDE3NjEzOTY3OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "selfhelp",
    isSale: true,
    salePercentage: 21,
  },
  {
    id: "8",
    name: "Milk and Honey",
    price: 14.5,
    rating: 4.3,
    reviewCount: 1567,
    image:
      "https://images.unsplash.com/photo-1592678279958-83f219e699c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2V0cnklMjBib29rcyUyMHZpbnRhZ2V8ZW58MXx8fHwxNzYxMzk2NzkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "poetry",
  },
  {
    id: "9",
    name: "The Invisible Life of Addie LaRue",
    price: 19.99,
    rating: 4.4,
    reviewCount: 1723,
    image:
      "https://images.unsplash.com/photo-1661936901394-a993c79303c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXJzJTIwZmljdGlvbnxlbnwxfHx8fDE3NjEzODcyMzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "fantasy",
  },
  {
    id: "10",
    name: "The Silent Patient",
    price: 21.0,
    rating: 4.1,
    reviewCount: 1456,
    image:
      "https://images.unsplash.com/photo-1698954634383-eba274a1b1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwdGhyaWxsZXIlMjBib29rc3xlbnwxfHx8fDE3NjEzOTY3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "mystery",
  },
  {
    id: "11",
    name: "Project Hail Mary",
    price: 26.5,
    rating: 4.8,
    reviewCount: 1891,
    image:
      "https://images.unsplash.com/photo-1758655212547-0f4f8554ddd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMGJvb2tzfGVufDF8fHx8MTc2MTM5Njc5MXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "scifi",
  },
  {
    id: "12",
    name: "Educated",
    price: 17.99,
    rating: 4.7,
    reviewCount: 2134,
    image:
      "https://images.unsplash.com/photo-1729569297607-c65f976471c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9ncmFwaHklMjBib29rcyUyMHNoZWxmfGVufDF8fHx8MTc2MTM5Njc5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "biography",
  },
];

const ITEMS_PER_PAGE = 8;

export function ProductCatalogue() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
  });

  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...mockProducts];

    // Apply filters
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    result = result.filter(
      (product) =>
        product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    if (filters.minRating > 0) {
      result = result.filter((product) => product.rating >= filters.minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // relevance - keep original order
        break;
    }

    return result;
  }, [filters, sortBy]);

  // Reset to page 1 when filters or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of products section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to display
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Desktop Filter Panel */}
        <div className="hidden lg:block flex-shrink-0">
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h1>Books ({filteredAndSortedProducts.length})</h1>

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
                    <FilterPanel
                      filters={filters}
                      onFiltersChange={setFilters}
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
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
          </div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No books found matching your filters.
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
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
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {currentProducts.map((product) => (
                  <Link href={`/products/${product.id}`} key={product.id}>
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
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
                              onClick={() => handlePageChange(page)}
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
