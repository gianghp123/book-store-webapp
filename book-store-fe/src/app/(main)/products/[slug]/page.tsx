import { ProductDetail } from "@/features/products/components/ProductDetail";
import {
  Product,
  ProductReview,
} from "@/features/products/dtos/response/product-response.dto";
import { dataProvider } from "@/provider/public-data-provider";


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
  ]

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data } = await dataProvider().getOne<Product>({resource: 'products', id: slug})
  
  return (
    <ProductDetail
      product={data}
      reviews={data.reviews || mockReviews || []}
    />
  );
}
