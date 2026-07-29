import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ProductProps } from "../../components/ItemCard/ItemCard";
import { HomeButton } from "../../components/Buttons/HomeButton/HomeButton";
import { productService } from "../../services/productService";
import "./style.css";
import { SaveButton } from "../../components/Buttons/SaveButton/SaveButton";

export const UpdateItem = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product as ProductProps | undefined;

  const [type, setType] = useState(product?.type?.toLowerCase() || "venda");
  const [state, setState] = useState(
    product?.state?.toLowerCase() || "semi_novo",
  );
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState<number | string>(product?.price ?? 0);
  const [loading, setLoading] = useState(false);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setType(selectedType);

    if (selectedType === "doacao" || selectedType === "troca") {
      setPrice(0);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;

    try {
      setLoading(true);

      const finalPrice =
        type === "doacao" || type === "troca" ? 0 : Number(price);

      await productService.update(String(product.id), {
        name,
        description,
        price: finalPrice,
        type,
        state,
      });

      navigate("/home");
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="updateitem-page">
        <div className="updateitem-wrapper">
          <div className="updateitem-card-large">
            <p>Nenhum produto selecionado para edição.</p>
          </div>
          <div className="card-action-container">
            <HomeButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="updateitem-page">
      <form onSubmit={handleSave} className="updateitem-wrapper">
        <div className="updateitem-card-large">
          <div className="card-tags-vertical-edit">
            <select
              value={type}
              onChange={handleTypeChange}
              className="input-inline-tag"
            >
              <option value="venda">VENDA</option>
              <option value="troca">TROCA</option>
              <option value="doacao">DOAÇÃO</option>
            </select>

            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="input-inline-tag"
            >
              <option value="novo">NOVO</option>
              <option value="semi_novo">SEMI-NOVO</option>
              <option value="usado">USADO</option>
            </select>
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-inline-title"
            placeholder="Nome do produto"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-inline-description"
            placeholder="Descrição do produto"
            rows={4}
            required
          />

          <div className="card-bottom">
            <div className="price-input-wrapper">
              <span className="currency-prefix">R$</span>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-inline-price"
                disabled={type === "doacao" || type === "troca"}
                required
              />
            </div>

            {product.user && (
              <span className="card-author">por: @{product.user.username}</span>
            )}
          </div>
        </div>

        <div className="card-action-container">
          <SaveButton loading={loading} />
          <HomeButton />
        </div>
      </form>
    </div>
  );
};