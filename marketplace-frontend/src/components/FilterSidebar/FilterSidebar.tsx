import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../NavBar/NavBar";
import { WishlistButton } from "../Buttons/WishlistButton/WishlistButton";
import { MyMessagesButton } from "../Buttons/MyMessagesButton/MyMessagesButton";
import "./FilterSidebar.css";

type FilterSidebarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  stateFilter: string;
  setStateFilter: (value: string) => void;
  onSearchSubmit: (e: React.SyntheticEvent) => void;
};

export const FilterSidebar = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  stateFilter,
  setStateFilter,
  onSearchSubmit,
}: FilterSidebarProps) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <aside className="sidebar-right">
      <div className="sidebar-content">
        <div
          className="user-greeting"
          style={{
            color: "#ffffff",
            fontSize: "1.2rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Olá, {username}
        </div>

        <button
          className="create-button-post"
          onClick={() => navigate("/create-item")}
        >
          + Criar Novo Anúncio
        </button>

        <hr className="sidebar-divider" />

        <div className="filters-container">
          <h3>Filtros de Busca</h3>

          <div className="filter-group">
            <label htmlFor="search">Nome do produto</label>
            <NavBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearchSubmit={onSearchSubmit}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="type">Tipo</label>
            <select
              id="type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="venda">Venda</option>
              <option value="troca">Troca</option>
              <option value="doacao">Doação</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="state">Estado de Conservação</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos os Estados</option>
              <option value="NOVO">Novo</option>
              <option value="SEMI_NOVO">Semi-novo</option>
              <option value="USADO">Usado</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className="sidebar-footer"
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <MyMessagesButton />
        <WishlistButton onClick={() => navigate("/wishlist")} />

        <button className="logout-button" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </aside>
  );
};
