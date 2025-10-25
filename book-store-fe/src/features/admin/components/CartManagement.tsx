"use client";
import { useState } from "react";
import { CartResponse } from "@/features/carts/dtos/response/cart-response.dto";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, ShoppingCart, Trash2 } from "lucide-react";
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

const initialCarts: CartResponse[] = [
  {
    id: "1",
    total: 43.97,
    createdAt: "2024-10-24T08:15:00Z",
    items: [
      {
        id: "1",
        product: {
          id: "1",
          title: "The Great Gatsby",
          description: "A classic American novel set in the Jazz Age",
          price: 15.99,
          rating: 4.5,
          ratingCount: 2453,
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-10-20T14:20:00Z",
          categories: [{ id: "1", name: "Fiction" }],
          authors: [{ id: "1", name: "F. Scott Fitzgerald" }],
        },
      },
      {
        id: "2",
        product: {
          id: "2",
          title: "1984",
          description: "Dystopian social science fiction novel",
          price: 12.99,
          rating: 4.7,
          ratingCount: 3842,
          createdAt: "2024-02-10T09:15:00Z",
          updatedAt: "2024-10-18T11:45:00Z",
          categories: [{ id: "1", name: "Fiction" }],
          authors: [{ id: "2", name: "George Orwell" }],
        },
      },
      {
        id: "3",
        product: {
          id: "3",
          title: "To Kill a Mockingbird",
          description: "A novel about racial injustice",
          price: 14.99,
          rating: 4.8,
          ratingCount: 4125,
          createdAt: "2024-03-05T08:00:00Z",
          updatedAt: "2024-10-22T16:30:00Z",
          categories: [{ id: "1", name: "Fiction" }],
          authors: [{ id: "3", name: "Harper Lee" }],
        },
      },
    ],
  },
  {
    id: "2",
    total: 15.99,
    createdAt: "2024-10-23T14:30:00Z",
    items: [
      {
        id: "4",
        product: {
          id: "1",
          title: "The Great Gatsby",
          description: "A classic American novel set in the Jazz Age",
          price: 15.99,
          rating: 4.5,
          ratingCount: 2453,
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-10-20T14:20:00Z",
          categories: [{ id: "1", name: "Fiction" }],
          authors: [{ id: "1", name: "F. Scott Fitzgerald" }],
        },
      },
    ],
  },
];

export function CartManagement() {
  const [carts, setCarts] = useState<CartResponse[]>(initialCarts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCart, setSelectedCart] = useState<CartResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCarts = carts.filter(cart =>
    cart.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredCarts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCarts = filteredCarts.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetails = (cart: CartResponse) => {
    setSelectedCart(cart);
    setIsDialogOpen(true);
  };

  const handleRemoveFromCart = (cartId: string, itemId: string) => {
    setCarts(carts.map(cart => {
      if (cart.id === cartId) {
        const updatedItems = cart.items.filter(item => item.id !== itemId);
        const updatedTotal = updatedItems.reduce((sum, item) => sum + item.product.price, 0);
        
        return {
          ...cart,
          items: updatedItems,
          total: updatedTotal,
        };
      }
      return cart;
    }));
    
    if (selectedCart && selectedCart.id === cartId) {
      const updatedItems = selectedCart.items.filter(item => item.id !== itemId);
      const updatedTotal = updatedItems.reduce((sum, item) => sum + item.product.price, 0);
      setSelectedCart({
        ...selectedCart,
        items: updatedItems,
        total: updatedTotal,
      });
    }
    
    toast.success("Item removed from cart");
  };

  const totalCartsValue = carts.reduce((sum, cart) => sum + cart.total, 0);
  const totalItems = carts.reduce((sum, cart) => sum + cart.items.length, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Cart Management</h1>
          <p className="text-gray-600 mt-1">View and manage customer shopping carts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Carts</p>
                <div className="text-2xl mt-1">{carts.length}</div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <div className="text-2xl mt-1">{totalItems}</div>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <div className="text-2xl mt-1">${totalCartsValue.toFixed(2)}</div>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search carts..."
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
                <TableHead>Cart ID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCarts.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell className="text-gray-500">#{cart.id}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{cart.items.length} items</Badge>
                  </TableCell>
                  <TableCell>${cart.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(cart.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(cart)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cart Details - #{selectedCart?.id}</DialogTitle>
          </DialogHeader>
          {selectedCart && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p>{new Date(selectedCart.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p>{selectedCart.items.length}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Cart Items</h3>
                <div className="space-y-3">
                  {selectedCart.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                      <ImageWithFallback
                        src={`https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200`}
                        alt={item.product.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p>{item.product.title}</p>
                        {item.product.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.product.description}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {item.product.categories.map(cat => (
                            <Badge key={cat.id} variant="secondary" className="text-xs">
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          by {item.product.authors.map(a => a.name).join(", ")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <p>${item.product.price.toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromCart(selectedCart.id, item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl">${selectedCart.total.toFixed(2)}</p>
                </div>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
