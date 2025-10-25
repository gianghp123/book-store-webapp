"use client";
import { useState } from "react";
import {
  Star,
  Heart,
  ShoppingCart,
  Share2,
  ChevronLeft,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageWithFallback } from "@/components/ImageWithFallBack";
import { Product, ProductReview } from "../dtos/response/product-response.dto";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { motion } from "motion/react";

interface ProductDetailProps {
  product: Product;
  reviews: ProductReview[];
  relatedProducts?: Product[];
}

export function ProductDetail({
  product,
  reviews,
  relatedProducts = [],
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const image =
    product.image ||
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=800&fit=crop";

  const handleAddToCart = () => {
    toast.success(
      `Added ${quantity} ${quantity > 1 ? "items" : "item"} to cart!`
    );
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
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

  const onProductClick = (productId: string) => {
    console.log(`Product clicked: ${productId}`);
  };

  const averageRating = product.rating;
  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="container mx-auto px-4 py-6">
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
                      i < Math.floor(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2">{averageRating.toFixed(1)}</span>
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
            <span className="text-3xl">${product.price.toFixed(2)}</span>
          </div>

          <Separator className="mb-6" />

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <label>Quantity:</label>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 min-w-[3rem] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button onClick={handleAddToCart} className="flex-1" size="lg">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant={isWishlisted ? "default" : "outline"}
              size="lg"
              onClick={handleWishlistToggle}
              className={isWishlisted ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
              />
            </Button>
            <Button variant="outline" size="lg" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

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
            <div className="mb-6 line-clamp-3">{product.description}</div>
          </div>
        </motion.div>
      </div>

      {/* Rating Summary */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
          <div className="text-5xl mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.floor(averageRating)
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
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="group cursor-pointer"
                onClick={() => onProductClick?.(relatedProduct.id)}
              >
                <div className="aspect-[3/4] mb-2 overflow-hidden rounded-lg bg-muted">
                  <ImageWithFallback
                    src={relatedProduct.image}
                    alt={relatedProduct.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h4 className="line-clamp-2 mb-1">{relatedProduct.title}</h4>
                <p className="text-muted-foreground">
                  ${relatedProduct.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
