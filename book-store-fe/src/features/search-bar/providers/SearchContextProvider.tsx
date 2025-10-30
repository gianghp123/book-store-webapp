import { createContext, useContext, ReactNode } from "react";
import { SearchType } from "@/lib/constants/enums";
import { useSearchBar } from "../hooks/useSearchBar";

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
  const { searchQuery, setSearchQuery, searchType, setSearchType, handleSearch } = useSearchBar();

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