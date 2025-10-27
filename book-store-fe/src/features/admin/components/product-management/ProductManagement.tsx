"use client";
import { DataTable } from "@/components/reusable/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/features/products/dtos/response/product-response.dto";
import { useTable } from "@refinedev/core";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { productColumns } from "./columns";
export function ProductManagement() {
  const {
    result,
    tableQuery,
    pageCount,
    pageSize,
    currentPage,
    setCurrentPage,
  } = useTable<Product>({
    resource: "products",
    pagination: {
      pageSize: 10,
    },
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    categoryIds: [] as string[],
    authorIds: [] as string[],
  });

  const handleOpenDialog = (product?: Product) => {
    // if (product) {
    //   setEditingProduct(product);
    //   setFormData({
    //     title: product.title,
    //     description: product.description || "",
    //     price: product.price.toString(),
    //     image: product.image,
    //     categoryIds: product.categories.map(c => c.id),
    //     authorIds: product.authors.map(a => a.id),
    //   });
    // } else {
    //   setEditingProduct(null);
    //   setFormData({
    //     title: "",
    //     description: "",
    //     price: "",
    //     image: "",
    //     categoryIds: [],
    //     authorIds: [],
    //   });
    // }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Product added successfully");

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    toast.success("Product deleted successfully");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your book inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {/* <div>
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.data?.map(category => (
                    <Badge
                      key={category.id}
                      variant={formData.categoryIds.includes(category.id) ? "default" : "outline"}
                      className="cursor-pointer"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div> */}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingProduct ? "Update" : "Add"} Product
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={productColumns}
            data={result.data}
            currentPage={currentPage}
            pageCount={pageCount}
            setCurrentPage={setCurrentPage}
            isLoading={tableQuery.isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
