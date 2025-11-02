import { createContext, useContext, ReactNode, useState } from "react";
import { SearchType } from "@/lib/constants/enums";
import { useSearchBar } from "../hooks/useSearchBar";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  searchInput: string;
  setSearchInput: (input: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchContextProviderProps {
  children: ReactNode;
}

export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
  const { searchQuery, setSearchQuery, searchType, setSearchType, searchInput, setSearchInput } = useSearchBar();
  

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      searchType,
      setSearchType,
      searchInput,
      setSearchInput,
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