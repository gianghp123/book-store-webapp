"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; 
import { cn } from "@/lib/utils";

interface CartPaginationProps {
  current: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  className?: string; 
}

export function CartPagination({
  current,
  pageCount,
  onPageChange,
  onPrevious,
  onNext,
  className,
}: CartPaginationProps) {
  
  // 2. Mang hàm getPaginationItems (từ Cart.tsx) vào đây
  // Nó sẽ dùng props (current, pageCount) thay vì state
  const getPaginationItems = () => {
    const pages: React.ReactNode[] = [];
    if (pageCount <= 5) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={current === i}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i); // Gọi hàm prop
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={current === 1}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(1); // Gọi hàm prop
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (current > 3) {
        pages.push(<PaginationEllipsis key="start-ellipsis" />);
      }
      let startPage = Math.max(2, current - 1);
      let endPage = Math.min(pageCount - 1, current + 1);
      if (current === 1) endPage = 3;
      if (current === pageCount) startPage = pageCount - 2;
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={current === i}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i); // Gọi hàm prop
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      if (current < pageCount - 2) {
        pages.push(<PaginationEllipsis key="end-ellipsis" />);
      }
      pages.push(
        <PaginationItem key={pageCount}>
          <PaginationLink
            href="#"
            isActive={current === pageCount}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(pageCount); // Gọi hàm prop
            }}
          >
            {pageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  };

  // 3. Đây là JSX của thanh phân trang
  return (
    <footer className="mt-4">
      {/* Sử dụng className được truyền từ cha (chứa "justify-start ml-55") */}
      <Pagination className={cn(className)}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPrevious(); // Gọi hàm prop
              }}
              aria-disabled={current === 1}
              className={
                current === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {getPaginationItems()}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNext(); // Gọi hàm prop
              }}
              aria-disabled={current === pageCount}
              className={
                current === pageCount
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </footer>
  );
}