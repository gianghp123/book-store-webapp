import { SearchType } from "@/lib/constants/enums";
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
  const [searchType, setSearchType] = useState<SearchType>(SearchType.NORMAL);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  return {
    searchType,
    setSearchType,
    searchQuery,
    setSearchQuery,
    searchInput,
    setSearchInput,
  };
};
