"use client";
import { ExpandableDataTable } from "@/components/reusable/expandable-data-table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/features/orders/dtos/response/order-response.dto";
import { Authenticated, HttpError, useTable } from "@refinedev/core";
import { myOrderColumns } from "./my-orders-columns";
import { MyOrdersSubRow } from "./MyOrdersSubRow";

export function MyOrders() {
  const { result, tableQuery, pageCount, currentPage, setCurrentPage } =
    useTable<Order, HttpError>({
      resource: "orders/me",
      dataProviderName: "admin",
      pagination: {
        pageSize: 10,
      },
      
      meta: {
        relations: ["items", "items.product", "items.product.book"],
      },
    });

  return (
    <Authenticated key="my-orders-page">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Orders</h1>
            <p className="text-gray-600 mt-1">
              View the history of orders you have placed.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpandableDataTable
              columns={myOrderColumns}
              data={result?.data}
              pageCount={pageCount}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              isLoading={tableQuery.isLoading}
              getRowCanExpand={() => true}
              renderSubComponent={({ row }) => <MyOrdersSubRow row={row} />}
            />
          </CardContent>
        </Card>
      </div>
    </Authenticated>
  );
}