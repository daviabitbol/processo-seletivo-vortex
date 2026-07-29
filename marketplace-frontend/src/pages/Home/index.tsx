import React, { useEffect, useState } from "react";
import { useFetchProducts } from "../../hooks/useFetchProducts";
import { useProductFilters } from "../../hooks/useProductFilters";
import { FilterSidebar } from "../../components/FilterSidebar/FilterSidebar";
import { ProductGrid } from "../../components/ProductGrid/ProductGrid";
import axios from "axios";
import "./style.css";
import { api } from "../../services/api";

const normalize = (str?: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
};

export const Home = () => {
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const { products, loading, error, fetchProducts } = useFetchProducts();
  const filterState = useProductFilters();
  const { searchTerm, typeFilter, stateFilter, filters } = filterState;
  const [submittedSearch, setSubmittedSearch] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await api.get("/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ids = response.data.data.map((item: any) => item.product.id);
        setWishlistProductIds(ids);
      } catch (err) {
        console.error("Erro ao carregar wishlist do usuário:", err);
      }
    };

    fetchWishlist();
  }, []);

  const currentUserUsername = localStorage.getItem("username");

  useEffect(() => {
    fetchProducts({
      ...filters,
      searchTerm: submittedSearch,
    });
  }, [submittedSearch, fetchProducts]);

  const handleSearchSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmittedSearch(searchTerm);
  };

  const displayedProducts = products.filter((p) => {
    const matchesSearch = submittedSearch
      ? normalize(p.name).includes(normalize(submittedSearch))
      : true;

    const matchesType =
      typeFilter && typeFilter !== "todos" && typeFilter !== ""
        ? normalize(p.type) === normalize(typeFilter)
        : true;

    const matchesState =
      stateFilter && stateFilter !== "todos" && stateFilter !== ""
        ? normalize(p.state) === normalize(stateFilter)
        : true;

    return matchesSearch && matchesType && matchesState;
  });

  return (
    <div className="home-layout">
      <main className="main-content">
        <header className="home-header">
          <h2>Produtos Cadastrados</h2>
        </header>

        <ProductGrid
          products={displayedProducts}
          loading={loading}
          error={error}
          currentUserUsername={currentUserUsername}
          wishlistProductIds={wishlistProductIds}
        />
      </main>

      <FilterSidebar {...filterState} onSearchSubmit={handleSearchSubmit} />
    </div>
  );
};
