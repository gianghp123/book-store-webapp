"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/features/products/dtos/response/product-response.dto";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/ImageWithFallBack";
import { Edit, Trash2, Star } from "lucide-react";

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="w-12 h-16 relative">
      <ImageWithFallback
        src={row.original.image || `https://covers.openlibrary.org/b/isbn/${row.original.isbn}-S.jpg`}
        alt={row.original.title}
        fetchPriority="high"
        fill  
      />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div>
        <div className="truncate max-w-xs">{row.original.title}</div>
        {row.original.description && (
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {row.original.description}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div>${row.original.price}</div>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        <span>{row.original.rating}</span>
        <span className="text-sm text-gray-500">({row.original.ratingCount})</span>
      </div>
    ),
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.categories?.slice(0, 2).map(cat => (
          <Badge key={cat.id} variant="secondary">{cat.name}</Badge>
        ))}
        {row.original.categories?.length > 2 && (
          <Badge variant="secondary">+{row.original.categories.length - 2}</Badge>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;
      
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Handle edit action
              console.log("Edit product:", product);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Handle delete action
              console.log("Delete product:", product.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      );
    },
  },
];