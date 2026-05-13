import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useLojaContext } from "../../hooks/useLojaContext";

import api from "../../../../services/api";
import "./LojaProdutos.css";

export default function LojaProdutos() {
  const { adicionarAoCarrinho } = useLojaContext();

  const [produtos, setProdutos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("TODOS");
  const [notificacao, setNotificacao] = useState("");

  const categorias = ["TODOS", ...new Set(produtos.map((p) => p.categoria))];
  const produtosFiltrados =
    categoriaSelecionada === "TODOS"
      ? produtos
      : produtos.filter((p) => p.categoria === categoriaSelecionada);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get("api/produtos");
        setProdutos(response.data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      }
    };

    fetchProdutos();
  }, []);

  const handleAddToCart = (produto, quantidade) => {
    adicionarAoCarrinho(produto, quantidade);
    setNotificacao(`${produto.nome} adicionado ao carrinho!`);
    setTimeout(() => setNotificacao(""), 2000);
  };

  return (
    <div className="loja-page">
      <div className="page-header">
        <h1>📦 Produtos</h1>
        <p className="page-subtitle">Explore nosso catálogo de produtos</p>
      </div>

      {notificacao && <div className="notification">✓ {notificacao}</div>}

      <div className="filtros-container">
        <div className="filtros">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              className={`filtro-btn ${categoriaSelecionada === categoria ? "active" : ""}`}
              onClick={() => setCategoriaSelecionada(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>

        <div className="resultado-filtro">
          {produtosFiltrados.length} produto
          {produtosFiltrados.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="produtos-grid">
        {produtosFiltrados.map((produto) => (
          <ProductCard
            key={produto.id}
            produto={produto}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {produtosFiltrados.length === 0 && (
        <div className="empty-state">
          <p>😕 Nenhum produto encontrado nesta categoria</p>
        </div>
      )}
    </div>
  );
}
