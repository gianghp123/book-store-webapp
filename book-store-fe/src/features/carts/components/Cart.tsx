"use client";

import { ImageWithFallback } from "@/components/ImageWithFallBack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Authenticated } from "@refinedev/core";
import { ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CartItem, CartResponse } from "../dtos/response/cart-response.dto";
import { cartService } from "../services/cartService";
import { CartPagination } from "./CartPagination";
import { useCartItemsCount } from "@/features/carts/context/CartItemsCountContext";

interface Props {
  cartResponse?: CartResponse;
}

const ShoppingCart1Page = ({ cartResponse }: Props) => {
  const { refresh: refreshCartItemsCount } = useCartItemsCount();
  const [items, setItems] = useState(cartResponse?.items || []);
  const [current, setCurrent] = useState(1);
  const itemsPerPage = 3;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToConfirmDelete, setItemToConfirmDelete] =
    useState<CartItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalItems = items.length;
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (current - 1) * itemsPerPage;
  const endIndex = current * itemsPerPage;

  const currentItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + (parseFloat(item.product?.price as any) || 0),
      0
    );
  }, [items]);

  const handlePageChange = (page: number) => setCurrent(page);
  const handlePrevious = () => setCurrent((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrent((p) => Math.min(p + 1, pageCount));

  const handleOpenConfirm = (item: CartItem) => {
    setItemToConfirmDelete(item);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToConfirmDelete) return;

    const { product } = itemToConfirmDelete;
    setIsDeleting(true);

    try {
      const response = await cartService.removeItemFromCart({
        productId: product.id,
      });

      if (response.success) {
        toast.success("Product removed from cart successfully.");
        setItems((currentItems) =>
          currentItems.filter((item) => item.product.id !== product.id)
        );
        setIsConfirmOpen(false);
        setItemToConfirmDelete(null);
        refreshCartItemsCount();
      } else {
        toast.error(response.message || "Delete failed, please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Authenticated key="cart">
      <div>
        <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4 min-h-[416px]">
              {totalItems === 0 ? (
                <Card>
                  <CardContent className="p-10 text-center text-muted-foreground">
                    Your shopping cart is empty.
                  </CardContent>
                </Card>
              ) : (
                currentItems.map((item) => (
                  <Card key={item.id} className="p-0">
                    <CardContent className="flex gap-4 p-4">
                      <div className="relative h-36 w-24">
                        <ImageWithFallback
                          src={
                            item.product?.image ||
                            `https://covers.openlibrary.org/b/isbn/${item.product?.isbn}-M.jpg`
                          }
                          alt={item.product?.title || ""}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <Link href={`/products/${item.product?.id}`}>
                            <h3 className="font-medium text-lg hover:text-primary transition-colors cursor-pointer">
                              {item.product?.title}
                            </h3>
                          </Link>

                          {item.product?.authors &&
                            item.product.authors.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.product.authors.map((author) => (
                                  <Badge key={author.id} variant="outline">
                                    {author.name}
                                  </Badge>
                                ))}
                              </div>
                            )}

                          {item.product?.categories &&
                            item.product.categories.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.product.categories.map((category) => (
                                  <Badge key={category.id} variant="secondary">
                                    {category.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="text-right flex flex-col justify-between">
                        <span className="font-bold text-lg">
                          $
                          {(parseFloat(item.product?.price as any) || 0).toFixed(
                            2
                          )}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="relative"
                          onClick={() => handleOpenConfirm(item)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="size-6 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {pageCount > 1 && (
              <CartPagination
                current={current}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                onPrevious={handlePrevious}
                onNext={handleNext}
                className="justify-start ml-55"
              />
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h2 className="mb-4 text-lg font-bold">Order summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Original price
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Discount</span>
                    <span>-$0.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/payment">
                  <Button
                    className="mt-4 w-full"
                    size="lg"
                    disabled={totalItems === 0}
                  >
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

        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete
                <span className="font-bold">
                  {" "}
                  "{itemToConfirmDelete?.product.title}"{" "}
                </span>
                from cart?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => setItemToConfirmDelete(null)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Spinner className="mr-2" /> : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Authenticated>
  );
};

const ShoppingCart1 = (props: Props) => {
  return <ShoppingCart1Page {...props} />;
};

export { ShoppingCart1 };
