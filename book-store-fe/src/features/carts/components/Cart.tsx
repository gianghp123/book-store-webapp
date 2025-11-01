// Thêm 'use client' ở đầu tệp để sử dụng hook
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import { CartResponse } from "../dtos/response/cart-response.dto";
import Link from "next/link";
import { useState } from "react";
// Import component 'CartPagination'
import { CartPagination } from "./CartPagination"; //
import { Authenticated } from "@refinedev/core";

interface Props {
  cartResponse?: CartResponse;
}

const ShoppingCart1Page = ({ cartResponse }: Props) => {
  // Giữ toàn bộ state và logic tính toán ở component cha
  const [current, setCurrent] = useState(1);
  const itemsPerPage = 3;
  const totalItems = cartResponse?.items?.length || 0;
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (current - 1) * itemsPerPage;
  const endIndex = current * itemsPerPage;
  const currentItems = cartResponse?.items.slice(startIndex, endIndex) || [];

  const subtotal = cartResponse?.items.reduce(
    (acc, item) => acc + item.product.price,
    0
  );

  const handlePageChange = (page: number) => setCurrent(page);
  const handlePrevious = () => setCurrent((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrent((p) => Math.min(p + 1, pageCount));

  return (
    <Authenticated key="cart">
      <div>
        <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4 min-h-[416px]">
              {currentItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex gap-4 p-4">
                    <div className="relative h-24 w-24">
                      <Image
                        src={
                          item.product.image ||
                          `https://covers.openlibrary.org/b/isbn/${item.product.isbn}-M.jpg`
                        }
                        alt={item.product.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-medium">{item.product.title}</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.product.authors.map((author) => (
                            <Badge key={author.id} variant="outline">
                              {author.name}
                            </Badge>
                          ))}
                          {item.product.categories.map((category) => (
                            <Badge key={category.id} variant="secondary">
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground pt-2">
                        Ngày tạo: {item.product.createdAt}
                      </p>
                    </div>

                    <div className="text-right flex flex-col justify-between">
                      <span className="font-bold text-lg">
                        ${item.product.price}
                      </span>
                      <Button variant="ghost" size="sm" className="relative">
                        <Trash2 className="size-6 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {pageCount > 1 && (
              <CartPagination
                current={current}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                onPrevious={handlePrevious}
                onNext={handleNext}
                className="justify-start ml-55" // Giữ nguyên class 'ml-55' của bạn
              />
            )}
          </div>

          {/* Cột phải: Order summary (Không thay đổi) */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h2 className="mb-4 text-lg font-bold">Order summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Original price
                    </span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Discount</span>
                    <span>-$0</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${subtotal}</span>
                  </div>
                </div>
                <Link href="/payment">
                  <Button className="mt-4 w-full" size="lg">
                    Proceed to Payment
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="link" className="mt-2 w-full">
                    Continue Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-4">
                <h3 className="font-medium">
                  Do you have a voucher or gift card?
                </h3>
                <div className="flex gap-2">
                  <Input placeholder="Enter code" />
                  <Button>Apply Code</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Authenticated>
  );
};

const ShoppingCart1 = () => {
  return <ShoppingCart1Page />;
};

export { ShoppingCart1 };
