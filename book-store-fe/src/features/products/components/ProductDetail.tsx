"use client";
import { ImageWithFallback } from "@/components/ImageWithFallBack";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// Import thêm icon và component cần thiết
import {
  ChevronLeft,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Check, // Icon để chỉ đã thêm thành công
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Product, ProductReview } from "../dtos/response/product-response.dto";

// Import hooks và service
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cartService } from "@/features/carts/services/cartService";
import { Spinner } from "@/components/ui/spinner"; // Thêm Spinner
import { useCartItemsCount } from "@/features/carts/context/CartItemsCountContext";

interface ProductDetailProps {
  product: Product;
  reviews: ProductReview[];
  isAlreadyInCart: boolean; // <-- Nhận prop mới
}

export function ProductDetail({ product, reviews, isAlreadyInCart }: ProductDetailProps) {
  const router = useRouter(); // Hook để điều hướng
  const { refresh: refreshCartItemsCount } = useCartItemsCount();
  // State để quản lý trạng thái của nút
  // *** THAY ĐỔI: Khởi tạo state bằng prop nhận được từ server ***
  const [isAdded, setIsAdded] = useState(isAlreadyInCart);
  const [isLoading, setIsLoading] = useState(false);

  const image =
    product.image ||
    `https://covers.openlibrary.org/b/isbn/${product.isbn}-L.jpg`;

  // Cập nhật hàm handleAddToCart
  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const response = await cartService.addItemToCart({
        productId: product.id,
      });

      if (response.success) {
        toast.success(`Đã thêm ${product.title} vào giỏ!`);
        setIsAdded(true); // Thay đổi trạng thái nút
        refreshCartItemsCount();
      } else {
        // Xử lý lỗi cụ thể
        if (response.statusCode === 401) {
          toast.error("Bạn cần đăng nhập để thêm vào giỏ hàng.");
          router.push("/login"); // Chuyển hướng đến trang đăng nhập
        } else {
          toast.error(response.message || "Không thể thêm vào giỏ hàng.");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const onBack = () => {
    window.history.back();
  };

  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="container">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={onBack} className="cursor-pointer">
              <ChevronLeft className="h-4 w-4 inline mr-1" />
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {product.categories.length > 0 && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink className="cursor-pointer">
                  {product.categories[0].name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>{product.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex gap-8 mb-12">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="sticky top-4">
            {/* Main Image */}
            <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-muted max-h-[700px] min-h-[700px]">
              <ImageWithFallback
                src={image}
                alt={product.title}
                className="w-full h-full object-cover"
                preload
                fill
                unoptimized={true} // Thêm unoptimized
              />
            </div>
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Title & Authors */}
          <h1 className="mb-2 text-2xl font-bold">{product.title}</h1>
          {product.authors.length > 0 && (
            <p className="text-muted-foreground mb-4">
              by {product.authors.map((author) => author.name).join(", ")}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2">{product.rating}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <a
              href="#reviews"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {product.ratingCount} reviews
            </a>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl">${product.price}</span>
          </div>

          <Separator className="mb-6" />

          {/* === CẬP NHẬT NÚT BẤM === */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {isAdded ? (
              // Trạng thái 2: Đã thêm (View Cart)
              <Button
                onClick={() => router.push("/cart")}
                className="flex-1"
                size="lg"
                variant="outline" // Đổi thành outline
              >
                <Check className="h-5 w-5 mr-2" />
                View Cart
              </Button>
            ) : (
              // Trạng thái 1: Thêm vào giỏ (Add to Cart)
              <Button
                onClick={handleAddToCart}
                className="flex-1"
                size="lg"
                disabled={isLoading} // Vô hiệu hóa khi đang tải
              >
                {isLoading ? (
                  <Spinner className="mr-2" />
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                {isLoading ? "Adding..." : "Add to Cart"}
              </Button>
            )}

            {/* Các nút còn lại giữ nguyên */}
            <Button variant="outline" size="lg">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          {/* === KẾT THÚC CẬP NHẬT NÚT BẤM === */}


          {/* Categories */}
          {product.categories.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-2">Categories:</h4>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <Separator className="my-6" />
          <div>
            <div className="mb-6">{product.description}</div>
          </div>
        </motion.div>
      </div>

      {/* Rating Summary */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
          <div className="text-5xl mb-2">{product.rating}</div>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-muted-foreground">
            Based on {product.ratingCount} reviews
          </p>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="w-12">{stars} star</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{
                    width: `${
                      ((ratingDistribution[stars] || 0) / reviews.length) * 100
                    }%`,
                  }}
                />
              </div>
              <span className="w-12 text-right text-muted-foreground">
                {ratingDistribution[stars] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Reviews List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {reviews.length === 0 && (
          <p className="text-muted-foreground text-center min-h-[100px]">
            No review comments yet.
          </p>
        )}
        {reviews.map((review, index) => (
          <div key={index} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span>{review.username}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.createdAt && (
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <p className="text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}