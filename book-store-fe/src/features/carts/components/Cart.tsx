// src/features/carts/components/Cart.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import { CartResponse, CartItem } from "../dtos/response/cart-response.dto";
import Link from "next/link";
import { useState, useMemo } from "react";
import { CartPagination } from "./CartPagination";
import { ImageWithFallback } from "@/components/ImageWithFallBack";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { cartService } from "../services/cartService";

// *** THÊM CÁC COMPONENT DIALOG ĐÃ UPLOAD ***
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // Dùng để đóng Dialog
} from "@/components/ui/dialog";

// Định nghĩa lại Props để chấp nhận cartResponse có thể là null
interface Props {
  cartResponse: CartResponse | null; // Có thể null nếu fetch lỗi hoặc chưa có giỏ hàng
  imageFallbackUrl: string;
}

// Đây là component con xử lý logic hiển thị
const ShoppingCart1Page = ({ cartResponse, imageFallbackUrl }: Props) => {
  const [items, setItems] = useState(cartResponse?.items || []);
  const [current, setCurrent] = useState(1);
  const itemsPerPage = 3;

  // *** THÊM STATE CHO DIALOG XÁC NHẬN ***
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  // State để lưu item đang chuẩn bị xóa
  const [itemToConfirmDelete, setItemToConfirmDelete] = useState<CartItem | null>(
    null
  );
  // State loading, đổi tên cho rõ nghĩa
  const [isDeleting, setIsDeleting] = useState(false);

  // Tính toán dựa trên 'items' trong state
  const totalItems = items.length;
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (current - 1) * itemsPerPage;
  const endIndex = current * itemsPerPage;

  const currentItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + (parseFloat(item.price as any) || 0),
      0
    );
  }, [items]);
  // *** KẾT THÚC CẬP NHẬT STATE ***

  const handlePageChange = (page: number) => setCurrent(page);
  const handlePrevious = () => setCurrent((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrent((p) => Math.min(p + 1, pageCount));

  // Hàm này được gọi khi nhấn nút 'Trash2'
  const handleOpenConfirm = (item: CartItem) => {
    setItemToConfirmDelete(item);
    setIsConfirmOpen(true);
  };

  // Hàm này được gọi khi nhấn nút "Xóa" TRONG DIALOG
  const handleConfirmDelete = async () => {
    if (!itemToConfirmDelete) return;

    const { productId } = itemToConfirmDelete;
    setIsDeleting(true);

    try {
      const response = await cartService.removeItemFromCart({ productId });

      if (response.success) {
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
        // Cập nhật UI bằng cách xóa item khỏi state
        setItems((currentItems) =>
          currentItems.filter((item) => item.productId !== productId)
        );
        setIsConfirmOpen(false); // Đóng dialog
        setItemToConfirmDelete(null); // Reset item
      } else {
        toast.error(response.message || "Xóa thất bại, vui lòng thử lại.");
      }
    } catch (error: any) {
      toast.error(error.message || "Đã xảy ra lỗi.");
    } finally {
      setIsDeleting(false); // Hoàn tất, reset trạng thái loading
    }
  };

  return (
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
                <Card key={item.id}>
                  <CardContent className="flex gap-4 p-4">
                    <div className="relative h-24 w-24">
                      <ImageWithFallback
                        src={item.imageUrl || imageFallbackUrl}
                        alt={item.title}
                        fill
                        className="object-contain"
                        fallbackSrc={imageFallbackUrl}
                        unoptimized={true}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <Link href={`/products/${item.productId}`}>
                          <h3 className="font-medium text-lg hover:text-primary transition-colors cursor-pointer">
                            {item.title}
                          </h3>
                        </Link>

                        {item.authors && item.authors.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.authors.map((author) => (
                              <Badge key={author.id} variant="outline">
                                {author.name}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {item.categories && item.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.categories.map((category) => (
                              <Badge key={category.id} variant="secondary">
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground pt-2">
                        Ngày tạo: {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right flex flex-col justify-between">
                      <span className="font-bold text-lg">
                        ${(parseFloat(item.price as any) || 0).toFixed(2)}
                      </span>

                      {/* *** CẬP NHẬT NÚT XÓA: Mở Dialog *** */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="relative"
                        onClick={() => handleOpenConfirm(item)} // Mở dialog
                        disabled={isDeleting} // Vô hiệu hóa nếu đang xóa
                      >
                        <Trash2 className="size-6 text-red-500" />
                      </Button>
                      {/* *** KẾT THÚC CẬP NHẬT NÚT XÓA *** */}
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

        {/* Cột phải: Order summary */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h2 className="mb-4 text-lg font-bold">Order summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original price</span>
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

      {/* *** THÊM DIALOG XÁC NHẬN *** */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa
              {/* Hiển thị tên sách đang định xóa */}
              <span className="font-bold"> "{itemToConfirmDelete?.title}" </span>
              khỏi giỏ hàng không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {/* Nút Hủy (dùng DialogClose) */}
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setItemToConfirmDelete(null)}>
                Hủy
              </Button>
            </DialogClose>
            {/* Nút Xóa (gọi API) */}
            <Button
              variant="destructive"
              onClick={handleConfirmDelete} // Gọi hàm xác nhận xóa
              disabled={isDeleting} // Vô hiệu hóa khi đang tải
            >
              {isDeleting ? <Spinner className="mr-2" /> : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* *** KẾT THÚC DIALOG *** */}
    </div>
  );
};

// Component <ShoppingCart1> giờ chỉ là wrapper nhận props
// và truyền chúng xuống <ShoppingCart1Page>
const ShoppingCart1 = (props: Props) => {
  return <ShoppingCart1Page {...props} />;
};

export { ShoppingCart1 };