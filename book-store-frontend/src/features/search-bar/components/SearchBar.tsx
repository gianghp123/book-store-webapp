"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchType } from "@/lib/constants/enums";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchType, setSearchType] = useState<SearchType>(
    (searchParams.get("searchType") as SearchType) || SearchType.NORMAL
  );
  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || ""
  );

  const isSmart = searchType === SearchType.SMART;

  // Sync local state with URL changes
  useEffect(() => {
    const urlSearchType = searchParams.get("searchType") as SearchType;
    const urlQuery = searchParams.get("query");
    
    if (urlSearchType && urlSearchType !== searchType) {
      setSearchType(urlSearchType);
    }
    if (urlQuery !== null && urlQuery !== searchInput) {
      setSearchInput(urlQuery);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    
    // Set search parameters
    params.set("query", searchInput);
    params.set("searchType", searchType);
    params.set("page", "1"); // Reset to page 1 on new search
    
    // Clear filters when doing smart search
    if (searchType === SearchType.SMART) {
      params.delete("categoryIds");
      params.delete("minPrice");
      params.delete("maxPrice");
    }

    if (params.toString() === searchParams.toString()) return;
    
    router.push(`/?${params.toString()}`);
  };

  const handleSearchTypeChange = (value: SearchType) => {
    setSearchType(value);
    
    // If there's an active search, update URL immediately
    if (searchInput.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("searchType", value);
      params.set("page", "1");
      
      // Clear filters when switching to smart search
      if (value === SearchType.SMART) {
        params.delete("categoryIds");
        params.delete("minPrice");
        params.delete("maxPrice");
      }
      
      router.push(`/?${params.toString()}`);
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        className={`flex items-center gap-2 mx-4 rounded-2xl p-2 transition-all duration-300 ${
          isSmart
            ? "bg-gradient-to-r from-purple-600/10 via-pink-500/10 to-purple-600/10 shadow-[0_0_15px_-5px_rgba(192,132,252,0.6)]"
            : ""
        }`}
        animate={{ scale: isSmart ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Select value={searchType} onValueChange={handleSearchTypeChange}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger
                className={`w-[110px] transition-all ${
                  isSmart
                    ? "border-purple-500 text-purple-600 font-semibold focus-visible:ring-purple-500"
                    : "border-muted"
                }`}
              >
                <SelectValue />
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="center"
              sideOffset={6}
              className={`px-3 py-2 rounded-lg shadow-lg border text-sm font-medium flex items-center gap-2 ${
                isSmart
                  ? "bg-gradient-to-r from-purple-600/80 via-pink-500/80 to-purple-600/80 text-white border-purple-500/40 shadow-purple-500/30 backdrop-blur-md [&>span>svg.z-50]:invisible"
                  : "bg-white text-foreground border-border [&>span>svg.z-50]:invisible"
              }`}
            >
              {isSmart ? (
                <>
                  <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
                  <span>
                    Smart mode: uses advanced search based on your query
                  </span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span>Normal mode: simple title search</span>
                </>
              )}
            </TooltipContent>
          </Tooltip>

          <SelectContent>
            <SelectItem value={SearchType.NORMAL}>Normal</SelectItem>
            <SelectItem value={SearchType.SMART}>
              <div className="flex items-center gap-2 text-purple-600 font-semibold">
                <Sparkles className="w-4 h-4 text-yellow-600 animate-pulse" />
                Smart
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <form onSubmit={handleSubmit} className="hidden sm:flex relative max-w-sm flex-1">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isSmart ? "text-purple-500" : "text-muted-foreground"
            }`}
          />
          <Input
            placeholder={
              isSmart ? "Search intelligently..." : "Search products..."
            }
            className={`pl-10 transition-all ${
              isSmart
                ? "border-purple-400 bg-input-background focus-visible:ring-purple-500"
                : "bg-input-background"
            }`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <Button
          onClick={handleSubmit}
          className={`transition-all ${
            isSmart
              ? "bg-gradient-to-r from-purple-600/80 to-pink-500/80 hover:bg-purple-700 text-white shadow-lg shadow-purple-400/40"
              : ""
          }`}
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </motion.div>
    </TooltipProvider>
  );
}