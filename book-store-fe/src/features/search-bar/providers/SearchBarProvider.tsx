import { createContext, useContext } from "react";
import { useSearchBar } from "../hooks/useSearchBar";
import { SearchType } from "@/lib/constants/enums";

interface SearchBarContextProps {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  isSmart: boolean;
}

const SearchBarContext = createContext<SearchBarContextProps | undefined>(undefined);

interface SearchBarProviderProps {
  children: React.ReactNode;
  onSearch?: (searchType: SearchType, searchQuery: string) => void;
}

export const SearchBarProvider = ({ children, onSearch }: SearchBarProviderProps) => {
  const searchBar = useSearchBar({ onSearch });

  return (
    <SearchBarContext.Provider value={searchBar}>
      {children}
    </SearchBarContext.Provider>
  );
};

export const useSearchBarContext = () => {
  const context = useContext(SearchBarContext);
  if (context === undefined) {
    throw new Error("useSearchBarContext must be used within a SearchBarProvider");
  }
  return context;
};