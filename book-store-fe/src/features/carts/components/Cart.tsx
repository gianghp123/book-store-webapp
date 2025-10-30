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

interface Props {
  cartResponse: CartResponse;
  imageFallbackUrl: string;
}

const defaultProps: Props = {
  cartResponse: {
    id: "1",
    items: [
      {
        id: "1",
        product: {
          id: "1",
          title: "The Art of Clean Code: A Practical Guide",
          price: 1499,
          image:
            "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
          createdAt: "10/10/2023",
          updatedAt: "20/10/2023",
          categories: [
            { id: "cat-1", name: "Programming" },
            { id: "cat-2", name: "Software Engineering" },
            { id: "cat-3", name: "Web Development" },
            { id: "cat-4", name: "Software Engineering" },
            { id: "cat-5", name: "Programming" },
            { id: "cat-6", name: "Software Engineering" },
            { id: "cat-7", name: "Programming" },
            { id: "cat-8", name: "Software Engineering" },
          ],
          authors: [{ id: "auth-1", name: "Robert C. Martin" }],
        },
      },
      {
        id: "2",
        product: {
          id: "2",
          title:
            "A comprehensive introduction to modern JavaScript programming.",
          price: 598,
          image:
            "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
          description: "",
          createdAt: "10/10/2023",
          updatedAt: "20/10/2023",
          categories: [
            { id: "cat-1", name: "Programming" },
            { id: "cat-3", name: "Web Development" },
          ],
          authors: [{ id: "auth-2", name: "Sarah Chen" }],
        },
      },
      {
        id: "3",
        product: {
          id: "3",
          title: "Database Design for Mere Mortals",
          price: 850,
          image:
            "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
          description: "A hands-on guide to relational database design.",
          createdAt: "11/11/2023",
          updatedAt: "21/11/2023",
          categories: [{ id: "cat-9", name: "Database" }],
          authors: [{ id: "auth-3", name: "Michael J. Hernandez" }],
        },
      },
      {
        id: "4",
        product: {
          id: "4",
          title: "Designing Data-Intensive Applications",
          price: 1200,
          image:
            "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
          description:
            "The Big Ideas Behind Reliable, Scalable, and Maintainable Systems.",
          createdAt: "12/12/2023",
          updatedAt: "22/12/2023",
          categories: [
            { id: "cat-10", name: "System Design" },
            { id: "cat-9", name: "Database" },
          ],
          authors: [{ id: "auth-4", name: "Martin Kleppmann" }],
        },
      },
      {
        id: "5",
        product: {
          id: "5",
          title: "Grokking Algorithms",
          price: 750,
          image:
            "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
          description:
            "An illustrated guide for programmers and other curious people.",
          createdAt: "01/01/2024",
          updatedAt: "02/01/2024",
          categories: [
            { id: "cat-1", name: "Programming" },
            { id: "cat-11", name: "Algorithms" },
          ],
          authors: [{ id: "auth-5", name: "Aditya Bhargava" }],
        },
      },
      {
        id: "6",
        product: {
          id: "6",
          title: "The Pragmatic Programmer: Your Journey To Mastery",
          price: 1100,
          image:
            "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
          description: "20th Anniversary Edition.",
          createdAt: "02/02/2024",
          updatedAt: "03/02/2024",
          categories: [
            { id: "cat-2", name: "Software Engineering" },
            { id: "cat-1", name: "Programming" },
          ],
          authors: [
            { id: "auth-6", name: "David Thomas" },
            { id: "auth-7", name: "Andrew Hunt" },
          ],
        },
      },
      {
        id: "7",
        product: {
          id: "7",
          title: "Effective Java",
          price: 950,
          image:
            "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
          description: "3rd Edition.",
          createdAt: "03/03/2024",
          updatedAt: "04/03/2024",
          categories: [
            { id: "cat-1", name: "Programming" },
            { id: "cat-12", name: "Java" },
          ],
          authors: [{ id: "auth-8", name: "Joshua Bloch" }],
        },
      },
      {
        id: "8",
        product: {
          id: "8",
          title: "Clean Architecture",
          price: 1050,
          image:
            "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
          description:
            "A Craftsman's Guide to Software Structure and Design.",
          createdAt: "04/04/2024",
          updatedAt: "05/04/2024",
          categories: [{ id: "cat-2", name: "Software Engineering" }],
          authors: [{ id: "auth-1", name: "Robert C. Martin" }],
        },
      },
      {
        id: "9",
        product: {
          id: "9",
          title: "Introduction to Algorithms (CLRS)",
          price: 1800,
          image:
            "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
          description: "The standard textbook for algorithm courses.",
          createdAt: "05/05/2024",
          updatedAt: "06/05/2024",
          categories: [{ id: "cat-11", name: "Algorithms" }],
          authors: [
            { id: "auth-9", name: "Thomas H. Cormen" },
            { id: "auth-10", name: "Charles E. Leiserson" },
          ],
        },
      },
      {
        id: "10",
        product: {
          id: "10",
          title: "Domain-Driven Design",
          price: 1300,
          image:
            "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
          description: "Tackling Complexity in the Heart of Software.",
          createdAt: "06/06/2024",
          updatedAt: "07/06/2024",
          categories: [
            { id: "cat-2", name: "Software Engineering" },
            { id: "cat-10", name: "System Design" },
          ],
          authors: [{ id: "auth-11", name: "Eric Evans" }],
        },
      },
      {
        id: "11",
        product: {
          id: "11",
          title: "Refactoring: Improving the Design of Existing Code",
          price: 990,
          image:
            "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
          description: "Key techniques to improve code maintainability.",
          createdAt: "07/07/2024",
          updatedAt: "08/07/2024",
          categories: [{ id: "cat-2", name: "Software Engineering" }],
          authors: [{ id: "auth-12", name: "Martin Fowler" }],
        },
      },
    ],
    total: 12087,
    createdAt: "",
  },
  imageFallbackUrl:
    "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
};

const ShoppingCart1Page = ({ cartResponse, imageFallbackUrl }: Props) => {
  // Giữ toàn bộ state và logic tính toán ở component cha
  const [current, setCurrent] = useState(1);
  const itemsPerPage = 3;
  const totalItems = cartResponse.items.length;
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (current - 1) * itemsPerPage;
  const endIndex = current * itemsPerPage;
  const currentItems = cartResponse.items.slice(startIndex, endIndex);

  const subtotal = cartResponse.items.reduce(
    (acc, item) => acc + item.product.price,
    0
  );

  const handlePageChange = (page: number) => setCurrent(page);
  const handlePrevious = () => setCurrent((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrent((p) => Math.min(p + 1, pageCount));

  return (
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
                      src={item.product.image || imageFallbackUrl}
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
                  <span className="text-muted-foreground">Original price</span>
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
  );
};

const ShoppingCart1 = () => {
  return <ShoppingCart1Page {...defaultProps} />;
};

export { ShoppingCart1 };