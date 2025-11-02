import { ProductCategory } from "@/features/categories/dtos/response/category.dto";
import { ProductCatalogue } from "@/features/products/components/ProductCatalogue";
import { dataProvider } from "@/provider/data-provider";

export const dynamic = 'force-dynamic';

async function getALlCategories() {
  const response = await dataProvider(false).getList<ProductCategory>({
    resource: "categories",
    pagination: {
      pageSize: 10000,
    },
  });

  return response.data;
}

export default async function Home() {
  const categories = await getALlCategories();
  return <ProductCatalogue categories={categories} />;
}
