import React from 'react';
import './ProductCard.css';

export default function ProductCard({ produto, onAddToCart }) {
  const [quantidade, setQuantidade] = React.useState(1);

  const handleAdd = () => {
    onAddToCart(produto, quantidade);
    setQuantidade(1);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <div className="image-placeholder">📦</div>
        {produto.estoque <= 5 && produto.estoque > 0 && (
          <span className="estoque-badge">Pouco estoque</span>
        )}
        {produto.estoque === 0 && (
          <span className="fora-estoque">Fora de estoque</span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{produto.nome}</h3>
        <p className="product-category">{produto.categoria}</p>
        <p className="product-sku">SKU: {produto.sku}</p>

        <div className="product-stats">
          <span className="product-price">
            R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="product-stock">
            {produto.estoque} em estoque
          </span>
        </div>

        {produto.estoque > 0 ? (
          <div className="product-actions">
            <input
              type="number"
              min="1"
              max={produto.estoque}
              value={quantidade}
              onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
              className="quantidade-input"
            />
            <button
              className="btn-add-cart"
              onClick={handleAdd}
            >
              🛒 Adicionar
            </button>
          </div>
        ) : (
          <button className="btn-disabled" disabled>
            Indisponível
          </button>
        )}
      </div>
    </div>
  );
}
