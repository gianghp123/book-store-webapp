// src/features/categories/components/FilterPanel.tsx
'use client'
// Import thêm icon Search từ lucide-react
import { ChevronDown, Filter, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { dataProvider } from "@/provider/data-provider";
import { ProductCategory } from "../dtos/response/category.dto";
import { toast } from "sonner";

import { ProductFilterQueryDto } from "@/features/products/dtos/request/product.dto";

interface FilterPanelProps {
  filters: ProductFilterQueryDto;
  onFiltersChange: (filters: ProductFilterQueryDto) => void;
  onClose?: () => void;
  isMobile?: boolean;
}


export function FilterPanel({ filters, onFiltersChange, onClose, isMobile = false }: FilterPanelProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
  });

  const [apiCategories, setApiCategories] = useState<ProductCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await dataProvider().getList<ProductCategory>({
          resource: 'categories',
          pagination: {
            pageSize: 10000,
          }
        });
        setApiCategories(response.data || []);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        toast.error("Could not load categories for filtering.");
        setApiCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);


  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...(filters.categoryIds || []), categoryId]
      : (filters.categoryIds || []).filter(id => id !== categoryId);

    onFiltersChange({
      ...filters,
      categoryIds: newCategories,
    });
  };

  const handleMinPriceChange = (value: string) => {
    const price = parseFloat(value) || 0;
    onFiltersChange({
      ...filters,
      minPrice: price,
    });
  };

  const handleMaxPriceChange = (value: string) => {
    const price = parseFloat(value) || 1000;
    onFiltersChange({
      ...filters,
      maxPrice: price,
    });
  };

    const handlePriceSearch = () => {
    onFiltersChange(filters); // Trigger ProductCatalogue to update with current filters
  };



  const clearAllFilters = () => {
    onFiltersChange({
      categoryIds: [],
      minPrice: 0,
      maxPrice: 1000,
    });
  };

  const filterCount = (filters.categoryIds?.length || 0) +
    (filters.minPrice && filters.minPrice > 0 ? 1 : 0) +
    (filters.maxPrice && filters.maxPrice < 1000 ? 1 : 0);

  return (
    <Card className={`h-fit sticky top-20 ${isMobile ? 'w-full' : 'w-80'}`}>
      <CardHeader className="pb-3">
        {/* Header giữ nguyên */}
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
            {filterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
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
          onOpenChange={() => toggleSection('categories')}
        >
          {/* ... Nội dung Categories giữ nguyên ... */}
          <CollapsibleTrigger asChild>
             <Button variant="ghost" className="w-full justify-between h-auto">
               <span>Categories</span>
               <ChevronDown className={`h-4 w-4 transition-transform ${openSections.categories ? 'rotate-180' : ''}`} />
             </Button>
           </CollapsibleTrigger>
           <CollapsibleContent className="mt-3">
             {isLoadingCategories ? (
               <div className="flex justify-center items-center h-[300px]">
                 <Spinner />
               </div>
             ) : (
               apiCategories.length > 0 ? (
                 <ScrollArea className="h-[300px] pr-4">
                   <div className="space-y-3">
                     {apiCategories.map((category) => (
                       <div key={category.id} className="flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                           <Checkbox
                             id={`cat-${category.id}`}
                             checked={(filters.categoryIds || []).includes(category.id)}
                             onCheckedChange={(checked) =>
                               handleCategoryChange(category.id, checked as boolean)
                             }
                           />
                           <label htmlFor={`cat-${category.id}`} className="text-sm cursor-pointer">
                             {category.name}
                           </label>
                         </div>
                         <span className="text-xs text-muted-foreground">{category.bookCount}</span>
                       </div>
                     ))}
                   </div>
                 </ScrollArea>
               ) : (
                 <div className="text-sm text-muted-foreground text-center h-[300px] flex items-center justify-center">
                   No categories found.
                 </div>
               )
             )}
           </CollapsibleContent>
        </Collapsible>

        {/* Price Range Section */}
        <Collapsible
          open={openSections.price}
          onOpenChange={() => toggleSection('price')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-auto">
              <span>Price Range</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="minPrice" className="text-xs text-muted-foreground block mb-1">
                  Min Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="minPrice"
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(e) => handleMinPriceChange(e.target.value)}
                    className="pl-6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="maxPrice" className="text-xs text-muted-foreground block mb-1">
                  Max Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="maxPrice"
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                    className="pl-6"
                  />
                </div>
              </div>
            </div>
             <Button onClick={handlePriceSearch} size="sm" className="w-full mt-2">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Rating Section */}
      </CardContent>
    </Card>
  );
}