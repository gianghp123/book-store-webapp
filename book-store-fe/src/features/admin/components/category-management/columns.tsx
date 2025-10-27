"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductCategory } from "@/features/categories/dtos/response/category.dto";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { Edit, Trash2 } from "lucide-react";

export const categoryColumns: ColumnDef<ProductCategory>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="text-gray-500">{row.original.id}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FolderOpen className="h-4 w-4 text-blue-600" />
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "bookCount",
    header: "Book Count",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;
      
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Handle edit action
              console.log("Edit category:", category);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Handle delete action
              console.log("Delete category:", category.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      );
    },
  },
];