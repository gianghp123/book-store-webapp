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
import { ProductCategory } from "@/features/categories/dtos/response/category.dto";
import { HttpError, useTable } from "@refinedev/core";
import { FolderOpen, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { categoryColumns } from "./columns";

export function CategoryManagement() {
  const {
    result,
    tableQuery,
    pageCount,
    pageSize,
    currentPage,
    setCurrentPage,
  } = useTable<ProductCategory, HttpError>({
    resource: "categories",
    pagination: {
      pageSize: 10,
    },
    syncWithLocation: true,
    
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleOpenDialog = (category?: ProductCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    toast.success("Category deleted successfully");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Category Management</h1>
          <p className="text-gray-600 mt-1">
            Organize your products into categories
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Category Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="e.g., Fiction, Science, History"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingCategory ? "Update" : "Add"} Category
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
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Categories</p>
                  <div className="text-2xl mt-1">{result.total}</div>
                </div>
                <FolderOpen className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <DataTable
            columns={categoryColumns}
            data={result.data}
            pageCount={pageCount}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isLoading={tableQuery.isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
