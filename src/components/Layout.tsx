import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchPlaceholder: string;
  setSearchPlaceholder: (placeholder: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search...');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      searchPlaceholder,
      setSearchPlaceholder
    }}>
      <Navigation 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder={searchPlaceholder}
      />
      <Outlet />
    </SearchContext.Provider>
  );
};

export default Layout; 