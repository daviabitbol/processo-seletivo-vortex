import { ItemCard, type ProductProps } from "../ItemCard/ItemCard";
import "./ProductGrid.css";

export type ProductGridProps = {
  products: ProductProps[];
  loading: boolean;
  error: string | null;
  currentUserUsername?: string | null;
  wishlistProductIds?: string[];
}

export const ProductGrid = ({
  products,
  loading,
  error,
  currentUserUsername,
  wishlistProductIds = [],
}: ProductGridProps) => {
  if (loading) {
    return <div className="grid-message">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="grid-message error">Erro: {error}</div>;
  }

  if (products.length === 0) {
    return <div className="grid-message">Nenhum produto encontrado.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ItemCard
          key={product.id}
          product={product}
          currentUserUsername={currentUserUsername}
          isWishlisted={wishlistProductIds.includes(product.id)}
        />
      ))}
    </div>
  );
};