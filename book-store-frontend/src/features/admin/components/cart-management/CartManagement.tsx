"use client";
import { ExpandableDataTable } from "@/components/reusable/expandable-data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CartResponse } from "@/features/carts/dtos/response/cart-response.dto";
import { HttpError, useTable } from "@refinedev/core";
import { DollarSign, Search, ShoppingCart, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { cartColumns } from "./columns";
import { CartSubRow } from "./CartSubRow";

export function CartManagement() {
  const {
    result,
    tableQuery,
    pageCount,
    setCurrentPage,
    currentPage,
  } = useTable<CartResponse, HttpError>({
    resource: "carts",
    dataProviderName: "admin",
    pagination: {
      pageSize: 10,
    },
    meta: {
      relations: [
        "items",
        "items.product",
        "items.product.book",
        "items.product.categories",
        "items.product.authors",
        "user",
      ],
    },
  });
  const [searchTerm, setSearchTerm] = useState("");

  const columns = cartColumns;

  const cartStats = useMemo(() => {
    if (!result?.data) {
      return { activeCarts: 0, totalItems: 0, totalValue: 0 };
    }
    const totalItems = result.data.reduce(
      (acc, cart) => acc + cart.items.length,
      0
    );
    const totalValue = result.data.reduce(
      (acc, cart) => acc + (Number(cart.total) || 0),
      0
    );
    return {
      activeCarts: result.total,
      totalItems,
      totalValue,
    };
  }, [result?.data, result?.total]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Cart Management</h1>
          <p className="text-gray-600 mt-1">
            View and manage customer shopping carts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Carts</p>
                <div className="text-2xl mt-1">{cartStats.activeCarts}</div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <div className="text-2xl mt-1">{cartStats.totalItems}</div>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <div className="text-2xl mt-1">
                  ${cartStats.totalValue.toFixed(2)}
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search carts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ExpandableDataTable
            columns={columns} 
            data={result.data}
            isLoading={tableQuery.isLoading}
            currentPage={currentPage}
            pageCount={pageCount}
            setCurrentPage={setCurrentPage}
            getRowCanExpand={() => true}
            renderSubComponent={({ row }) => <CartSubRow row={row} />}
          />
        </CardContent>
      </Card>
    </div>
  );
}