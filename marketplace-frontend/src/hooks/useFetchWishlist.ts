import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { ProductProps } from "../components/ItemCard/ItemCard";

export const useFetchWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:3000/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const rawData = response.data?.data || [];
      const extractedProducts = rawData
        .map((item: any) => item.product)
        .filter(Boolean);

      setWishlistItems(extractedProducts);
    } catch (err) {
      console.error("Erro ao carregar wishlist:", err);
      setError("Não foi possível carregar a sua lista de desejos.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return {
    wishlistItems,
    loading,
    error,
    refetchWishlist: fetchWishlist,
    setWishlistItems,
  };
};