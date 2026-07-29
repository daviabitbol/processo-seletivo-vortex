import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import type { ProductProps } from "../../components/ItemCard/ItemCard";
import "./style.css";
import { HomeButton } from "../../components/Buttons/HomeButton/HomeButton";
import { GoToMyAnnouncesButton } from "../../components/Buttons/GoToMyAnnouncesButton/GoToMyAnnouncesButton";

export type TokenPayload = {
  sub?: string;
  userId?: string;
  id?: string;
  username?: string;
  exp?: number;
};

function getUserIdFromToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.sub || decoded.userId || decoded.id || null;
  } catch (error) {
    console.error("Erro ao decodificar token JWT:", error);
    return null;
  }
}

export function CheckItem() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product as ProductProps | undefined;

  const currentUserId = getUserIdFromToken();
  const ownerId =
    product?.user?.id || (product as any)?.userId || (product as any)?.user_id;

  const isMyItem = Boolean(
    currentUserId && ownerId && String(currentUserId) === String(ownerId),
  );

  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!product?.id) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:3000/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const wishlistItems = response.data?.data || [];
        const existsInWishlist = wishlistItems.some(
          (item: any) => item.product?.id === product.id
        );

        setIsStarred(existsInWishlist);
      } catch (error) {
        console.error("Erro ao verificar status da wishlist:", error);
      }
    };

    checkWishlistStatus();
  }, [product]);

  const handleStarClick = async () => {
    if (!product?.id) return;

    const previousState = isStarred;
    const nextState = !previousState;

    setIsStarred(nextState);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (nextState) {
        await axios.post(`http://localhost:3000/wishlist/${product.id}`, {}, { headers });
      } else {
        await axios.delete(`http://localhost:3000/wishlist/${product.id}`, { headers });
      }
    } catch (error) {
      console.error("Erro ao atualizar wishlist:", error);
      setIsStarred(previousState);
    }
  };

  const handleUpdate = () => {
    if (!product) return;
    navigate("/update-item", { state: { product } });
  };

  const handleDelete = () => {
    if (!product) return;
    navigate("/delete-item", { state: { product } });
  };

  const handleChatClick = () => {
    if (!product) return;

    const currentUserUsername = localStorage.getItem("username");
    const roomName = `#${product.id}#${product.user?.username}#${currentUserUsername}#`;

    navigate("/my-messages", {
      state: {
        room: roomName,
        product: product,
        sellerUsername: product.user?.username,
        buyerUsername: currentUserUsername,
      },
    });
  };

  if (!product) {
    return (
      <div className="checkitem-page">
        <div className="checkitem-wrapper">
          <div className="checkitem-card-large">
            <p className="no-product-text">Nenhum produto selecionado.</p>
          </div>
          <div className="card-action-container">
            <button onClick={() => navigate("/home")} className="btn-home">
              Voltar para Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkitem-page">
      <div className="checkitem-wrapper">
        <div className="checkitem-card-large" style={{ position: "relative" }}>
          
          {!isMyItem && (
            <div
              onClick={handleStarClick}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                fontSize: "28px",
                color: isStarred ? "#FFD700" : "#CCC",
                cursor: "pointer",
                zIndex: 2,
              }}
              title={isStarred ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              {isStarred ? "★" : "☆"}
            </div>
          )}

          <div className="card-tags-vertical">
            <span className="tag-item type-tag">{product.type}</span>
            <span className="tag-item state-tag">{product.state}</span>
          </div>

          <h2 className="card-title">{product.name}</h2>

          <p className="card-description">{product.description}</p>

          <div className="card-bottom">
            <strong className="card-price">
              {product.type === "venda" && `R$ ${product.price ?? 0}`}
              {product.type === "troca" && "Troca"}
              {product.type === "doacao" && "Doação"}
            </strong>
            {product.user && (
              <span className="card-author">por: @{product.user.username}</span>
            )}
          </div>

          {/* Botão de Iniciar Chat para os visitantes do produto */}
          {!isMyItem && (
            <button className="btn-iniciar-chat" onClick={handleChatClick}>
              💬 Iniciar chat
            </button>
          )}

          {isMyItem && (
            <div className="actions-container">
              <button onClick={handleUpdate} className="button-action button-update">
                Atualizar
              </button>
              <button onClick={handleDelete} className="button-action button-delete">
                Apagar
              </button>
            </div>
          )}
        </div>

        <div className="card-action-container">
          <HomeButton />
          {isMyItem && <GoToMyAnnouncesButton />}
        </div>
      </div>
    </div>
  );
}