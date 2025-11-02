import { SearchType } from "@/lib/constants/enums";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface UseSearchBarReturn {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchInput: string;
  setSearchInput: (input: string) => void;
}

export const useSearchBar = (): UseSearchBarReturn => {
  const searchParams = useSearchParams();
  const [searchType, setSearchType] = useState<SearchType>(searchParams.get("searchType") as SearchType || SearchType.NORMAL);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("query") || "");
  

  return {
    searchType,
    setSearchType,
    searchQuery,
    setSearchQuery,
    searchInput,
    setSearchInput,
  };
};
