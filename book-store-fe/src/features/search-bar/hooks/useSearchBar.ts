import { useState } from "react";
import { SearchType } from "@/lib/constants/enums";

interface UseSearchBarReturn {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  isSmart: boolean;
}

interface UseSearchBarProps {
  onSearch?: (searchType: SearchType, searchQuery: string) => void;
}

export const useSearchBar = (props?: UseSearchBarProps): UseSearchBarReturn => {
  const [searchType, setSearchType] = useState<SearchType>(SearchType.NORMAL);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (props?.onSearch) {
      props.onSearch(searchType, searchQuery);
    } else {
      console.log("Search button clicked with filters:", {
        searchType,
        searchQuery,
      });
    }
  };

  const isSmart = searchType === SearchType.SMART;

  return {
    searchType,
    setSearchType,
    searchQuery,
    setSearchQuery,
    handleSearch,
    isSmart,
  };
};