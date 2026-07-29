import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ItemCard,
  type ProductProps,
} from "../../components/ItemCard/ItemCard";
import { NavBar } from "../../components/NavBar/NavBar";
import { HomeButton } from "../../components/Buttons/HomeButton/HomeButton";
import "./style.css";

const api = axios.create({
  baseURL: "http://localhost:3000",
});


export type ProductType = 'venda' | 'doacao' | 'troca';

export type ProductState = 'novo' | 'semi_novo' | 'usado';

function getUserIdFromToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const decodedPayload = JSON.parse(atob(payloadBase64));
    return (
      decodedPayload.sub || decodedPayload.id || decodedPayload.userId || null
    );
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}

export const CreateItem = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [type, setType] = useState<ProductType>('venda');
  const [state, setState] = useState<ProductState>('novo');

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [myProducts, setMyProducts] = useState<ProductProps[]>([]);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

const fetchMyProducts = async () => {
  try {
    setFetchLoading(true);
    setFetchError(null);

    const token = localStorage.getItem('token');
    const currentUserId = getUserIdFromToken();

    if (!token || !currentUserId) {
      setFetchError('Usuário não autenticado.');
      setFetchLoading(false);
      return;
    }

    const params: Record<string, string> = {};
    if (searchTerm.trim()) params.name = searchTerm.trim();
    if (typeFilter) params.type = typeFilter;
    if (stateFilter) params.state = stateFilter;

    const response = await api.get('/products', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let list: ProductProps[] = response.data.filter(
      (product: any) => String(product.user?.id) === String(currentUserId)
    );

    if (typeFilter) {
      list = list.filter(
        (p) => p.type?.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    if (stateFilter) {
      const normalize = (str?: string) =>
        str?.toLowerCase().replace(/[-_]/g, '') || '';

      list = list.filter(
        (p) => normalize(p.state) === normalize(stateFilter)
      );
    }

    setMyProducts(list);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    setFetchError('Não foi possível carregar seus produtos.');
  } finally {
    setFetchLoading(false);
  }
};

  useEffect(() => {
    fetchMyProducts();
  }, [typeFilter, stateFilter]);

  const handleSearchSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    fetchMyProducts();
  };

  const handleCreateProduct = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem("token");

      const finalPrice = (type === 'doacao' || type === 'troca') 
      ? 0 
      : Number(price);

      const payload = {
        name,
        description,
        price: finalPrice,
        type,
        state,
      };

      await api.post("/products", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMsg("Produto cadastrado com sucesso!");

      setName("");
      setDescription("");
      setPrice("");
      setType('venda');
      setState('novo');

      fetchMyProducts();
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      setCreateError("Falha ao cadastrar o produto. Tente novamente.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <>
      <div className="create-item-page">
        <section className="form-section">
          <div className="form-card">
            <h2>Menu de Criação de Item</h2>
            <p className="subtitle">
              Cadastre um novo produto para disponibilizar na plataforma.
            </p>

            {createError && <p className="status-msg error">{createError}</p>}
            {successMsg && <p className="status-msg success">{successMsg}</p>}

            <form onSubmit={handleCreateProduct} className="create-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="prod-name">Nome do produto *</label>
                  <input
                    id="prod-name"
                    type="text"
                    required
                    placeholder="Ex: Monitor Dell 27 polegadas"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prod-type">Tipo *</label>
                  <select
                    id="prod-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as ProductType)}
                  >
                    <option value={'venda'}>Venda</option>
                    <option value={'doacao'}>Doação</option>
                    <option value={'troca'}>Troca</option>
                  </select>
                </div>

                {type === 'venda' && (
                  <div className="form-group">
                    <label htmlFor="prod-price">Preço (R$) *</label>
                    <input
                      id="prod-price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                      value={price}
                      onChange={(e) =>
                        setPrice(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="prod-state">Estado de Conservação *</label>
                  <select
                    id="prod-state"
                    value={state}
                    onChange={(e) => setState(e.target.value as ProductState)}
                  >
                    <option value={'novo'}>Novo</option>
                    <option value={'semi_novo'}>Semi-novo</option>
                    <option value={'usado'}>Usado</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="prod-desc">Descrição</label>
                <textarea
                  id="prod-desc"
                  rows={3}
                  placeholder="Detalhes adicionais sobre o produto..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div
                className="card-action-container"
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={createLoading}
                >
                  {createLoading ? "Salvando..." : "Cadastrar Produto"}
                </button>
                <HomeButton />
              </div>
            </form>
          </div>
        </section>

        <hr className="section-divider" />

        <section className="products-section">
          <header className="section-header">
            <h3>Meus Anúncios Cadastrados</h3>
          </header>

          <div className="filters-bar">
            <div className="filter-item search-filter">
              <NavBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearchSubmit={handleSearchSubmit}
              />
            </div>

            <div className="filter-item">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Todos os Tipos</option>
                <option value="venda">Venda</option>
                <option value="troca">Troca</option>
                <option value="doacao">Doação</option>
              </select>
            </div>

            <div className="filter-item">
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
              >
                <option value="">Todos os Estados</option>
                <option value="novo">Novo</option>
                <option value="semi_novo">Semi-novo</option>
                <option value="usado">Usado</option>
              </select>
            </div>
          </div>

          {fetchLoading && (
            <p className="status-msg">Carregando seus anúncios...</p>
          )}
          {fetchError && <p className="status-msg error">{fetchError}</p>}

          {!fetchLoading && !fetchError && myProducts.length === 0 && (
            <p className="status-msg">
              Você ainda não possui anúncios cadastrados com estes filtros.
            </p>
          )}

          {!fetchLoading && !fetchError && (
            <div className="product-grid">
              {myProducts.map((product) => (
                <ItemCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};
