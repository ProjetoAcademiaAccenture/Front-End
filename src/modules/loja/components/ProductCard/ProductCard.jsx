import React from 'react';
import PropTypes from 'prop-types';
import {ShoppingCart } from 'lucide-react';

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
        <div className="image-placeholder">
          <img src={produto.urlImagem} alt={produto.nome}/>
        </div>
        {produto.quantidadeEstoque <= 5 && produto.quantidadeEstoque > 0 && (
          <span className="estoque-badge">Pouco estoque</span>
        )}
        {produto.quantidadeEstoque === 0 && (
          <span className="fora-estoque">Fora de estoque</span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{produto.nome}</h3>
        <p className="product-category">{produto.categoria}</p>

        <div className="product-stats">
          <span className="product-price">
            R${" "}
            {produto.preco.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </span>
          <span className="product-stock">
            {produto.quantidadeEstoque} em estoque
          </span>
        </div>

        {produto.quantidadeEstoque > 0 ? (
          <div className="product-actions">
            <input
              type="number"
              min="1"
              max={produto.quantidadeEstoque}
              value={quantidade}
              onChange={(e) =>
                setQuantidade(Math.max(1, Number.parseInt(e.target.value) || 1))
              }
              className="quantidade-input"
            />
            <button className="btn-add-cart" onClick={handleAdd}>
              <ShoppingCart /> Adicionar
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

ProductCard.propTypes = {
  produto: PropTypes.shape({
    nome: PropTypes.string.isRequired,
    urlImagem: PropTypes.string.isRequired,
    quantidadeEstoque: PropTypes.number.isRequired,
    categoria: PropTypes.string.isRequired,
    preco: PropTypes.number.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};
