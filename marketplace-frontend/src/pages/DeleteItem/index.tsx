import { useLocation, useNavigate } from "react-router-dom";
import type { ProductProps } from "../../components/ItemCard/ItemCard";
import "./style.css";
import { api } from "../../services/api";

export function DeleteItem() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product as ProductProps | undefined;

  const handleConfirmDelete = async () => {
    if (!product?.id) return;

    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/products/${product.id}`);
    } catch (error) {
      console.error("Erro ao apagar item:", error);
    }
  };

  if (!product) {
    return (
      <div className="deleteitem-page">
        <div className="deleteitem-wrapper">
          <div className="deleteitem-card-large">
            <p>Nenhum produto selecionado para apagar.</p>
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
    <div className="deleteitem-page">
      <div className="deleteitem-wrapper">
        <div className="deleteitem-card-large">
          <div className="card-tags-vertical">
            <span className="tag-item">{product.type}</span>
            <span className="tag-item">{product.state}</span>
          </div>

          <h2 className="card-title">{product.name}</h2>
          <p className="card-description">{product.description}</p>

          <div className="card-bottom">
            <strong className="card-price">R$ {product.price ?? 0}</strong>
            {product.user && (
              <span className="card-author">por: @{product.user.username}</span>
            )}
          </div>

          <div className="delete-confirmation-box">
            <p>Tem certeza que deseja apagar este anúncio?</p>
            <div className="delete-actions">
              <button
                onClick={handleConfirmDelete}
                className="btn-confirm-delete"
              >
                Sim, Apagar
              </button>
              <button onClick={() => navigate(-1)} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </div>
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
