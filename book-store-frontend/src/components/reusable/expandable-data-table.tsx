// Tệp mới: src/components/reusable/expandable-data-table.tsx
"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel, // <-- Tính năng quan trọng
  useReactTable,
  Row, // <-- Import Row
} from "@tanstack/react-table";
import { Spinner } from "../ui/spinner";
import React from "react"; // <-- Import React

interface ExpandableDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentPage: number;
  pageCount: number;
  setCurrentPage: (page: number) => void;
  isLoading?: boolean;
  // Props dành riêng cho việc mở rộng
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement;
  getRowCanExpand?: (row: Row<TData>) => boolean;
}

export function ExpandableDataTable<TData, TValue>({
  columns,
  data,
  currentPage,
  pageCount,
  setCurrentPage,
  isLoading = false,
  renderSubComponent, // Nhận prop
  getRowCanExpand, // Nhận prop
}: ExpandableDataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Kích hoạt tính năng mở rộng
    getRowCanExpand,
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  {/* Hàng chính */}
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Hàng chi tiết (khi mở rộng) */}
                  {row.getIsExpanded() && renderSubComponent && (
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        {renderSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? (
                    <div className="w-full flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : (
                    "No results."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination (giữ nguyên) */}
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
}