// src/app/(main)/products/[slug]/page.tsx
import { getCartAction } from "@/features/carts/actions/cart.actions"; // Import cart action
import { ProductDetail } from "@/features/products/components/ProductDetail";
import {
  Product,
  ProductReview,
} from "@/features/products/dtos/response/product-response.dto";
import { dataProvider } from "@/provider/data-provider";

export const mockReviews: ProductReview[] = [
  {
    username: "SeniorDev",
    rating: 5,
    comment:
      "A classic that stands the test of time. I refer back to this book constantly.",
    createdAt: new Date("2024-09-25T00:00:00Z"),
  },
  {
    username: "ReactFanatic",
    rating: 5,
    comment:
      "Hooks finally make sense! This book covers everything from useState to custom hooks brilliantly.",
    createdAt: new Date("2024-10-14T00:00:00Z"),
  },
  {
    username: "FrontendDev",
    rating: 4,
    comment:
      "Really helpful for understanding hooks. The performance optimization chapter is gold.",
    createdAt: new Date("2024-10-07T00:00:00Z"),
  },
  {
    username: "TypeScriptLover",
    rating: 5,
    comment:
      "This book helped me transition from JavaScript to TypeScript smoothly. The generic types section is excellent.",
    createdAt: new Date("2024-10-16T00:00:00Z"),
  },
  {
    username: "FullStackDev",
    rating: 4,
    comment:
      "Comprehensive coverage of TypeScript. Great for both beginners and intermediate developers.",
    createdAt: new Date("2024-10-09T00:00:00Z"),
  },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let isAlreadyInCart = false;

  // 1. Fetch sản phẩm
  const { data: productData } = await dataProvider(false).getOne<Product>({
    resource: "products",
    id: slug,
  });

  // 2. Fetch giỏ hàng của user (nếu đã đăng nhập)
  try {
    // Gọi service getCart (API /cart/me)
    const cartResponse = await getCartAction();

    if (cartResponse.success && cartResponse.data?.items) {
      // 3. Kiểm tra xem product slug có nằm trong danh sách items của giỏ hàng không
      // (Dùng productId vì DTO giỏ hàng đã được làm phẳng)
      isAlreadyInCart = cartResponse.data.items.some(
        (item) => item.product.id === slug
      );
    }
    // Nếu lỗi (vd: 401 chưa đăng nhập), isAlreadyInCart sẽ giữ nguyên là false
  } catch (error) {
    console.warn(
      "Could not fetch cart status (user might not be logged in).",
      error
    );
    isAlreadyInCart = false; // Đảm bảo an toàn
  }

  // 4. Truyền trạng thái (isAlreadyInCart) xuống Client Component
  return (
    <ProductDetail
      product={productData}
      reviews={productData.reviews || mockReviews || []}
      isAlreadyInCart={isAlreadyInCart} // <-- Prop mới
    />
  );
}
