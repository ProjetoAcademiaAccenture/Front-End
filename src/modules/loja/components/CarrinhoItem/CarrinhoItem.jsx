import './CarrinhoItem.css';
import { Trash } from 'lucide-react';
import PropTypes from 'prop-types';

export default function CarrinhoItem({ item, onQuantidadeChange, onRemove }) {
  return (
    <div className="carrinho-item">
      <div className="item-image">📦</div>

      <div className="item-info">
        <h3>{item.nome}</h3>
        <p className="item-category">{item.categoria}</p>
      </div>

      <div className="item-price">
        R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </div>

      <div className="item-quantidade">
        <button
          onClick={() => onQuantidadeChange(item.id, item.quantidade - 1)}
          className="btn-qty"
        >
          −
        </button>
        <span className="qty-value">{item.quantidade}</span>
        <button
          onClick={() => onQuantidadeChange(item.id, item.quantidade + 1)}
          className="btn-qty"
        >
          +
        </button>
      </div>

      <div className="item-subtotal">
        R$ {(item.preco * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="btn-remove"
      >
      <Trash color="#f80909"/>

      </button>
    </div>
  );
}

CarrinhoItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nome: PropTypes.string.isRequired,
    categoria: PropTypes.string.isRequired,
    preco: PropTypes.number.isRequired,
    quantidade: PropTypes.number.isRequired,
  }).isRequired,
  onQuantidadeChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
