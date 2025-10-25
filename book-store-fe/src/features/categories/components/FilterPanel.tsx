'use client'
import { ChevronDown, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const bookCategories = [
  { id: "fiction", label: "Fiction", count: 342 },
  { id: "non-fiction", label: "Non-Fiction", count: 289 },
  { id: "mystery", label: "Mystery & Thriller", count: 156 },
  { id: "romance", label: "Romance", count: 198 },
  { id: "scifi", label: "Science Fiction", count: 134 },
  { id: "fantasy", label: "Fantasy", count: 167 },
  { id: "biography", label: "Biography", count: 98 },
  { id: "history", label: "History", count: 124 },
  { id: "selfhelp", label: "Self-Help", count: 187 },
  { id: "business", label: "Business & Finance", count: 145 },
  { id: "cooking", label: "Cooking", count: 89 },
  { id: "travel", label: "Travel", count: 76 },
  { id: "children", label: "Children's Books", count: 234 },
  { id: "youngadult", label: "Young Adult", count: 178 },
  { id: "poetry", label: "Poetry", count: 67 },
  { id: "drama", label: "Drama", count: 54 },
  { id: "classics", label: "Classics", count: 112 },
  { id: "science", label: "Science & Nature", count: 93 },
  { id: "art", label: "Art & Photography", count: 81 },
  { id: "religion", label: "Religion & Spirituality", count: 72 },
];

export function FilterPanel({ filters, onFiltersChange, onClose, isMobile = false }: FilterPanelProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    rating: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId);
    
    onFiltersChange({
      ...filters,
      categories: newCategories,
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

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      minRating: rating,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      minPrice: 0,
      maxPrice: 1000,
      minRating: 0,
    });
  };

  const filterCount = filters.categories.length + 
    (filters.minPrice > 0 || filters.maxPrice < 1000 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0);

  return (
    <Card className={`h-fit sticky top-20 ${isMobile ? 'w-full' : 'w-80'}`}>
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
        {/* Categories with Scroll */}
        <Collapsible 
          open={openSections.categories}
          onOpenChange={() => toggleSection('categories')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span>Categories</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.categories ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {bookCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category.id, checked as boolean)
                        }
                      />
                      <label htmlFor={category.id} className="text-sm cursor-pointer">
                        {category.label}
                      </label>
                    </div>
                    <span className="text-xs text-muted-foreground">{category.count}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range */}
        <Collapsible 
          open={openSections.price}
          onOpenChange={() => toggleSection('price')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
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
          </CollapsibleContent>
        </Collapsible>

        {/* Rating */}
        <Collapsible 
          open={openSections.rating}
          onOpenChange={() => toggleSection('rating')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span>Minimum Rating</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.rating ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.minRating === rating}
                  onCheckedChange={(checked) => 
                    handleRatingChange(checked ? rating : 0)
                  }
                />
                <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-1">
                  {rating}+ Stars
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
