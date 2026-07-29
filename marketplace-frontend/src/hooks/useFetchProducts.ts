import { useState, useCallback } from "react";
import { productService } from "../services/productService";
import type { ProductProps } from "../components/ItemCard/ItemCard";

export const useFetchProducts = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);

      const cleanParams: Record<string, string> = {};

      if (filters?.searchTerm && filters.searchTerm.trim() !== "") {
        cleanParams.name = filters.searchTerm.trim();
      }

      if (
        filters?.typeFilter &&
        filters.typeFilter !== "todos" &&
        filters.typeFilter !== ""
      ) {
        cleanParams.type = filters.typeFilter.toUpperCase();
      }
      if (
        filters?.stateFilter &&
        filters.stateFilter !== "todos" &&
        filters.stateFilter !== ""
      ) {
        cleanParams.state = filters.stateFilter.toUpperCase();
      }

      const data = await productService.getAll(cleanParams);
      setProducts(data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
  };
};
