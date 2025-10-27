"use client";

import { Card } from "@/components/ui/card";
import { ProductCategory } from "@/features/categories/dtos/response/category.dto";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";

interface CategoriesListProps {
  categories?: ProductCategory[];
}

export const defaultProps: CategoriesListProps = {
  categories: [
    { id: "1", name: "Computer & Office", bookCount: 10 },
    { id: "2", name: "Gaming/Consoles", bookCount: 10 },
    { id: "3", name: "Books", bookCount: 10 },
    { id: "4", name: "Fashion/Clothes", bookCount: 10 },
    { id: "5", name: "Sports & Outdoors", bookCount: 10 },
    { id: "6", name: "Painting & Hobby", bookCount: 10 },
    { id: "7", name: "Electronics", bookCount: 10 },
    { id: "8", name: "Music", bookCount: 10 },
    { id: "9", name: "TV/Projectors", bookCount: 10 },
    { id: "10", name: "Health & beauty", bookCount: 10 },
    { id: "11", name: "Home Air Quality", bookCount: 10 },
    { id: "12", name: "Photo/Video", bookCount: 10 },
    { id: "13", name: "Security & Wi-Fi", bookCount: 10 },
    { id: "14", name: "Computer Peripherals", bookCount: 10 },
    { id: "15", name: "Phone Accessories", bookCount: 10 },
    { id: "16", name: "Watches", bookCount: 10 },
    { id: "17", name: "Printers", bookCount: 10 },
    { id: "18", name: "Projectors", bookCount: 10 },
    { id: "19", name: "Skin Care", bookCount: 10 },
    { id: "20", name: "Office Supplies", bookCount: 10 },
    { id: "21", name: "Computer & Office", bookCount: 10 },
    { id: "22", name: "Gaming/Consoles", bookCount: 10 },
    { id: "23", name: "Books", bookCount: 10 },
    { id: "24", name: "Fashion/Clothes", bookCount: 10 },
    { id: "25", name: "Sports & Outdoors", bookCount: 10 },
    { id: "26", name: "Painting & Hobby", bookCount: 10 },
    { id: "27", name: "Electronics", bookCount: 10 },
    { id: "28", name: "Music", bookCount: 10 },
    { id: "29", name: "TV/Projectors", bookCount: 10 },
    { id: "30", name: "Health & beauty", bookCount: 10 },
  ],
}

const CategoriesList = ({
  categories = defaultProps.categories,
}: CategoriesListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  return (
      <div>
        <div className="mb-8 flex items-center justify-between space-y-2">
          <h2 className="text-lg font-bold tracking-tighter sm:text-xl md:text-2xl">
            Shop by category
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories?.map((category) => (
            <Card
              key={category.id}
              className="flex items-center space-x-4 p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span className="text-sm font-medium">{category.name}</span>
            </Card>
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
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
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
                  } else if (
                    page === currentPage - 2 || 
                    page === currentPage + 2
                  ) {
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
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
      </div>
  );
};

export { CategoriesList };
