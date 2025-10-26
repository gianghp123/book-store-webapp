"use client";

import { Card } from "@/components/ui/card";
import { Category } from "@/lib/dtos/response/category-response.dto";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";

interface CategoriesListProps {
  categories?: Category[];
}

export const defaultProps = {
  categories: [
    { id: "1", name: "Computer & Office" },
    { id: "2", name: "Gaming/Consoles" },
    { id: "3", name: "Books" },
    { id: "4", name: "Fashion/Clothes" },
    { id: "5", name: "Sports & Outdoors" },
    { id: "6", name: "Painting & Hobby" },
    { id: "7", name: "Electronics" },
    { id: "8", name: "Music" },
    { id: "9", name: "TV/Projectors" },
    { id: "10", name: "Health & beauty" },
    { id: "11", name: "Home Air Quality" },
    { id: "12", name: "Photo/Video" },
    { id: "13", name: "Security & Wi-Fi" },
    { id: "14", name: "Computer Peripherals" },
    { id: "15", name: "Phone Accessories" },
    { id: "16", name: "Watches" },
    { id: "17", name: "Printers" },
    { id: "18", name: "Projectors" },
    { id: "19", name: "Skin Care" },
    { id: "20", name: "Office Supplies" },
    { id: "21", name: "Computer & Office" },
    { id: "22", name: "Gaming/Consoles" },
    { id: "23", name: "Books" },
    { id: "24", name: "Fashion/Clothes" },
    { id: "25", name: "Sports & Outdoors" },
    { id: "26", name: "Painting & Hobby" },
    { id: "27", name: "Electronics" },
    { id: "28", name: "Music" },
    { id: "29", name: "TV/Projectors" },
    { id: "30", name: "Health & beauty" },
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
          {categories.map((category) => (
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
