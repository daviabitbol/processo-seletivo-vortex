import React from 'react';
import './NavBar.css';

export type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearchSubmit: (e: React.SyntheticEvent) => void;
  placeholder?: string;
}

export const NavBar = ({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  placeholder = 'Ex: Calculadora científica CASIO',
}: SearchBarProps) => {
  return (
    <form onSubmit={onSearchSubmit} className="search-bar-form">
      <div className="search-box">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </div>
    </form>
  );
};