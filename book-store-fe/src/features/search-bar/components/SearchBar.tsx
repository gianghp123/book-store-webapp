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
import { useSearchContext } from "../providers/SearchContextProvider";

export function SearchBar() {
  const {
    searchType,
    setSearchType,
    setSearchQuery,
    searchInput,
    setSearchInput,
  } = useSearchContext();

  const isSmart = searchType === SearchType.SMART;

  const handleSubmit = (e: React.FormEvent) => {
    console.log(searchInput);
    e.preventDefault();
    setSearchQuery(searchInput);
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
        <Select
          value={searchType}
          onValueChange={(value) => setSearchType(value as SearchType)}
        >
          {/* 
            NOTE: The `open` prop is removed from <Tooltip> so it behaves normally (on hover).
            You can add it back for debugging if needed.
          */}
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
              {/* Tooltip text + icon */}
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

        <div className="hidden sm:flex relative max-w-sm flex-1">
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
        </div>

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
