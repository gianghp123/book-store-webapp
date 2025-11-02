// src/features/categories/components/FilterPanel.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ProductCategory } from "../dtos/response/category.dto";
import { ProductFilterQueryDto } from "@/features/products/dtos/request/product.dto";

interface FilterPanelProps {
  filters: ProductFilterQueryDto;
  onFiltersChange: (filters: ProductFilterQueryDto) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  onClose?: () => void;
  isMobile?: boolean;
  categories: ProductCategory[];
}

export function FilterPanel({
  categories,
  filters,
  onFiltersChange,
  onClearFilters,
  onApplyFilters,
  onClose,
  isMobile = false,
}: FilterPanelProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
  });

  const [categoryIds, setCategoryIds] = useState<string[]>(
    filters.categoryIds || []
  );
  const [minPrice, setMinPrice] = useState<number | undefined>(
    filters.minPrice
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    filters.maxPrice
  );

  // Sync local state with filters prop when it changes (e.g., from URL)
  useEffect(() => {
    setCategoryIds(filters.categoryIds || []);
    setMinPrice(filters.minPrice);
    setMaxPrice(filters.maxPrice);
  }, [filters]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...categoryIds, categoryId]
      : categoryIds.filter((id) => id !== categoryId);

    setCategoryIds(newCategories);
    // Update parent component's local state
    onFiltersChange({
      ...filters,
      categoryIds: newCategories,
    });
  };

  const handleMinPriceChange = (value: string) => {
    const newMinPrice = value === "" ? undefined : parseFloat(value);
    setMinPrice(newMinPrice);
    // Update parent component's local state
    onFiltersChange({
      ...filters,
      minPrice: newMinPrice,
    });
  };

  const handleMaxPriceChange = (value: string) => {
    const newMaxPrice = value === "" ? undefined : parseFloat(value);
    setMaxPrice(newMaxPrice);
    // Update parent component's local state
    onFiltersChange({
      ...filters,
      maxPrice: newMaxPrice,
    });
  };

  // Calculate filter count based on local state
  const filterCount =
    categoryIds.length +
    (minPrice !== undefined && minPrice > 0 ? 1 : 0) +
    (maxPrice !== undefined && maxPrice < Infinity ? 1 : 0);

  const handleApplyFilters = () => {
    onApplyFilters();
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleClearFilters = () => {
    setCategoryIds([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    onClearFilters();
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <Card className={`h-fit sticky top-20 ${isMobile ? "w-full" : "w-80"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {filterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {filterCount}
              </span>
            )}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Clear All
            </Button>
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Categories Section */}
        <Collapsible
          open={openSections.categories}
          onOpenChange={() => toggleSection("categories")}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-auto">
              <span className="font-semibold">Categories</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openSections.categories ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            {categories.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${category.id}`}
                          checked={categoryIds.includes(category.id)}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(
                              category.id,
                              checked as boolean
                            )
                          }
                        />
                        <label
                          htmlFor={`cat-${category.id}`}
                          className="text-sm cursor-pointer hover:text-primary transition-colors"
                        >
                          {category.name}
                        </label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {category.bookCount}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-sm text-muted-foreground text-center h-[300px] flex items-center justify-center">
                No categories found.
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range Section */}
        <Collapsible
          open={openSections.price}
          onOpenChange={() => toggleSection("price")}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-auto">
              <span className="font-semibold">Price Range</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openSections.price ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="minPrice"
                  className="text-xs text-muted-foreground block mb-1"
                >
                  Min Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="minPrice"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={minPrice ?? ""}
                    onChange={(e) => handleMinPriceChange(e.target.value)}
                    className="pl-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="maxPrice"
                  className="text-xs text-muted-foreground block mb-1"
                >
                  Max Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="maxPrice"
                    type="number"
                    min="0"
                    placeholder="999"
                    value={maxPrice ?? ""}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                    className="pl-6"
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={handleApplyFilters}
              size="sm"
              className="w-full mt-2"
            >
              <Search className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}