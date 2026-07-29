import { useState } from 'react';

export function useProductFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStateFilter('');
  };

  return {
    filters: { searchTerm, typeFilter, stateFilter },
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    stateFilter,
    setStateFilter,
    clearFilters,
  };
}