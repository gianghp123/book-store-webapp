"use client";
import { useState } from "react";
import { Product, ProductCategory, ProductAuthor } from "@/features/products/dtos/response/product-response.dto";
import { Card, CardContent, CardHeader} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "@/components/ImageWithFallBack";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data
const mockCategories: ProductCategory[] = [
  { id: "1", name: "Fiction" },
  { id: "2", name: "Non-Fiction" },
  { id: "3", name: "Science" },
  { id: "4", name: "History" },
];

const mockAuthors: ProductAuthor[] = [
  { id: "1", name: "F. Scott Fitzgerald" },
  { id: "2", name: "George Orwell" },
  { id: "3", name: "Harper Lee" },
  { id: "4", name: "Jane Austen" },
];

const initialProducts: Product[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    title: "The Great Gatsby",
    description: "A classic American novel set in the Jazz Age",
    price: 15.99,
    rating: 4.5,
    ratingCount: 2453,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-10-20T14:20:00Z",
    categories: [mockCategories[0]],
    authors: [mockAuthors[0]],
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    title: "1984",
    description: "Dystopian social science fiction novel",
    price: 12.99,
    rating: 4.7,
    ratingCount: 3842,
    createdAt: "2024-02-10T09:15:00Z",
    updatedAt: "2024-10-18T11:45:00Z",
    categories: [mockCategories[0]],
    authors: [mockAuthors[1]],
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    title: "To Kill a Mockingbird",
    description: "A novel about racial injustice and childhood innocence",
    price: 14.99,
    rating: 4.8,
    ratingCount: 4125,
    createdAt: "2024-03-05T08:00:00Z",
    updatedAt: "2024-10-22T16:30:00Z",
    categories: [mockCategories[0]],
    authors: [mockAuthors[2]],
  },
];

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = 1
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description || "",
        price: product.price.toString(),
        image: product.image,
        categoryIds: product.categories.map(c => c.id),
        authorIds: product.authors.map(a => a.id),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        image: "",
        categoryIds: [],
        authorIds: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCategories = mockCategories.filter(c => formData.categoryIds.includes(c.id));
    const selectedAuthors = mockAuthors.filter(a => formData.authorIds.includes(a.id));

    if (editingProduct) {
      setProducts(products.map(p =>
        p.id === editingProduct.id
          ? {
              ...p,
              title: formData.title,
              description: formData.description,
              price: parseFloat(formData.price),
              image: formData.image,
              categories: selectedCategories,
              authors: selectedAuthors,
              updatedAt: new Date().toISOString(),
            }
          : p
      ));
      toast.success("Product updated successfully");
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image || "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
        rating: 0,
        ratingCount: 0,
        categories: selectedCategories,
        authors: selectedAuthors,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
      toast.success("Product added successfully");
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Product deleted successfully");
  };

  const toggleCategory = (categoryId: string) => {
    setFormData({
      ...formData,
      categoryIds: formData.categoryIds.includes(categoryId)
        ? formData.categoryIds.filter(id => id !== categoryId)
        : [...formData.categoryIds, categoryId],
    });
  };

  const toggleAuthor = (authorId: string) => {
    setFormData({
      ...formData,
      authorIds: formData.authorIds.includes(authorId)
        ? formData.authorIds.filter(id => id !== authorId)
        : [...formData.authorIds, authorId],
    });
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
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mockCategories.map(category => (
                    <Badge
                      key={category.id}
                      variant={formData.categoryIds.includes(category.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCategory(category.id)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Authors</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mockAuthors.map(author => (
                    <Badge
                      key={author.id}
                      variant={formData.authorIds.includes(author.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleAuthor(author.id)}
                    >
                      {author.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingProduct ? "Update" : "Add"} Product
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Authors</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <ImageWithFallback
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{product.title}</div>
                      {product.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{product.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({product.ratingCount})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.categories.map(cat => (
                        <Badge key={cat.id} variant="secondary">{cat.name}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.authors.map(author => (
                        <Badge key={author.id} variant="outline">{author.name}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  if (showPage) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    page === currentPage - 2 || 
                    page === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
        </CardContent>
      </Card>
    </div>
  );
}
