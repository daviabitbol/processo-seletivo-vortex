import './WishlistButton.css';

type WishlistButtonProps = {
  onClick?: () => void;
}

export const WishlistButton = ({ onClick }: WishlistButtonProps) => {
  return (
    <button className="wishlist-btn" onClick={onClick}>
      🛒 Lista de desejos
    </button>
  );
};