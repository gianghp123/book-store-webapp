import { createContext, useContext, ReactNode, useState } from "react";
import { SearchType } from "@/lib/constants/enums";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  handleSearch: (query?: string, type?: SearchType) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchContextProviderProps {
  children: ReactNode;
}

export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>(SearchType.NORMAL);

  const handleSearch = (query?: string, type?: SearchType) => {
    const actualQuery = query || searchQuery;
    const actualType = type || searchType;
    console.log("Search executed with:", {
      searchType: actualType,
      searchQuery: actualQuery,
    });
    // In a real implementation, you would trigger the search here
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      searchType,
      setSearchType,
      handleSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchContextProvider");
  }
  return context;
};