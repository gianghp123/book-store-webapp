"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductCategory } from "@/features/categories/dtos/response/category.dto";
import { useTable } from "@refinedev/core";
import Link from "next/link";

const CategoriesList = () => {
  const { result, pageCount, setCurrentPage, currentPage } =
    useTable<ProductCategory>({
      resource: "categories",
      pagination: {
        pageSize: 49,
      },
      syncWithLocation: true,
    });
  return (
    <div>
      <div className="mb-8 flex items-center justify-between space-y-2">
        <h2 className="text-lg font-bold tracking-tighter sm:text-xl md:text-2xl">
          Shop by category
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {result?.data?.map((category) => (
          <Link href={`/`} key={category.id}>
            <Card
              className="flex items-center justify-center gap-0 p-4 transition-colors hover-shadow-purple-pink"
            >
              <span className="text-sm font-medium">{category.name}</span>
              <Badge variant="secondary">{category.bookCount}</Badge>
            </Card>
          </Link>
        ))}
      </div>
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {Array.from({ length: pageCount }, (_, index) => {
            const page = index + 1;
            const showPage =
              page === 1 ||
              page === pageCount ||
              (page >= currentPage - 1 && page <= currentPage + 1);

            if (showPage) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <PaginationItem key={page}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < pageCount) setCurrentPage(currentPage + 1);
              }}
              className={
                currentPage === pageCount
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export { CategoriesList };
