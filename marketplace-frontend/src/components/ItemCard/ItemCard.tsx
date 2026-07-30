import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ItemCard.css";
import { api } from "../../services/api";

export type ProductProps = {
  id: string;
  name: string;
  description: string;
  price?: number;
  type: string;
  state: string;
  user: {
    id?: string;
    username: string;
  };
};

export type ItemCardProps = {
  product: ProductProps;
  currentUserUsername?: string | null;
  isWishlisted?: boolean;
};

export const ItemCard = ({
  product,
  currentUserUsername,
  isWishlisted = false,
}: ItemCardProps) => {
  const navigate = useNavigate();

  const [isStarred, setIsStarred] = useState(isWishlisted);

  useEffect(() => {
    setIsStarred(isWishlisted);
  }, [isWishlisted]);

  const handleCardClick = () => {
    navigate(`/check-item`, { state: { product } });
  };

  const handleStarClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const previousState = isStarred;
    const nextState = !previousState;

    setIsStarred(nextState);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (nextState) {
        await api.post(
          `/wishlist/${product.id}`,
          {},
          { headers }
        );
      } else {
        await api.delete(`/wishlist/${product.id}`, {
          headers,
        });
      }
    } catch (error) {
      console.error("Erro na requisição da wishlist:", error);
      setIsStarred(previousState);
    }
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();

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

  const currentLoggedUser = currentUserUsername || localStorage.getItem("username");

  const isOwner =
    product.user?.username?.trim().toLowerCase() ===
    currentLoggedUser?.trim().toLowerCase();

  return (
    <div
      className="item-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer", position: "relative" }}
    >
      {!isOwner && (
        <div
          onClick={handleStarClick}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            fontSize: "24px",
            color: isStarred ? "#FFD700" : "#CCC",
            zIndex: 2,
          }}
          title={
            isStarred ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
        >
          {isStarred ? "★" : "☆"}
        </div>
      )}

      <div className="card-tags">
        <span className="tag-type">{product.type?.toUpperCase()}</span>
        <span className="tag-state"> | </span>
        <span className="tag-state">
          {product.state?.replace("_", "-").toUpperCase()}
        </span>
      </div>

      <h3 className="card-title">{product.name}</h3>
      <p className="card-description">{product.description}</p>

      <div className="card-footer">
        <span className="price">
          {product.type === "venda" && `R$ ${product.price}`}
          {product.type === "troca" && "Troca"}
          {product.type === "doacao" && "Doação"}
        </span>

        <strong>
          <span className="author">por: @{product.user?.username}</span>
        </strong>
      </div>

      {!isOwner && (
        <button className="btn-iniciar-chat" onClick={handleChatClick}>
          💬 Iniciar chat
        </button>
      )}
    </div>
  );
};