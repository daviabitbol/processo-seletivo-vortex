import { HomeButton } from "../../components/Buttons/HomeButton/HomeButton";
import { ItemCard } from "../../components/ItemCard/ItemCard";
import { useFetchWishlist } from "../../hooks/useFetchWishlist";
import "./style.css";

export const Wishlist = () => {
  const { wishlistItems, loading, error } = useFetchWishlist();

  return (
    <div className="wishlist-container">
      <header className="wishlist-header">
        <h1>🛒 Minha Lista de Desejos</h1>
        <HomeButton />
      </header>
      <main className="wishlist-content">
        {loading && <p className="loading-message">Carregando seus favoritos...</p>}
        {!loading && error && <p className="error-message">{error}</p>}
        {!loading && !error && wishlistItems.length === 0 && (
          <p className="empty-message">Sua lista de desejos está vazia.</p>
        )}
        {!loading && !error && wishlistItems.length > 0 && (
          <div className="product-grid">
            {wishlistItems.map((item) => (
              <ItemCard key={item.id} product={item} isWishlisted={true} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;