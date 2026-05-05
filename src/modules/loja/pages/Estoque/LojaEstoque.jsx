import React, { useState } from 'react';
import { useLojaContext } from '../../hooks/useLojaContext';
import './LojaEstoque.css';

export default function LojaEstoque() {
  const { produtos, atualizarEstoque } = useLojaContext();
  const [edicao, setEdicao] = useState(null);
  const [novoEstoque, setNovoEstoque] = useState('');

  const handleEditar = (id, estoqueAtual) => {
    setEdicao(id);
    setNovoEstoque(estoqueAtual);
  };

  const handleSalvar = (id) => {
    const quantidade = parseInt(novoEstoque);
    if (quantidade >= 0) {
      atualizarEstoque(id, quantidade);
      setEdicao(null);
    }
  };

  const totalEstoque = produtos.reduce((sum, p) => sum + p.estoque, 0);
  const produtosBaixoEstoque = produtos.filter((p) => p.estoque <= 5 && p.estoque > 0);
  const produtosFora = produtos.filter((p) => p.estoque === 0);

  return (
    <div className="loja-page">
      <div className="page-header">
        <h1>📊 Gerenciar Estoque</h1>
        <p className="page-subtitle">Controle de inventário e produtos</p>
      </div>

      <div className="estoque-stats">
        <div className="stat-card">
          <h3>Total em Estoque</h3>
          <p className="valor">{totalEstoque}</p>
        </div>

        <div className="stat-card">
          <h3>Produtos</h3>
          <p className="valor">{produtos.length}</p>
        </div>

        <div className="stat-card alerta">
          <h3>Baixo Estoque</h3>
          <p className="valor">{produtosBaixoEstoque.length}</p>
        </div>

        <div className="stat-card critico">
          <h3>Fora de Estoque</h3>
          <p className="valor">{produtosFora.length}</p>
        </div>
      </div>

      <div className="estoque-table">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id} className={`status-${produto.estoque === 0 ? 'fora' : produto.estoque <= 5 ? 'baixo' : 'ok'}`}>
                <td className="sku">{produto.sku}</td>
                <td>{produto.nome}</td>
                <td>{produto.categoria}</td>
                <td>R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="estoque-cell">
                  {edicao === produto.id ? (
                    <input
                      type="number"
                      value={novoEstoque}
                      onChange={(e) => setNovoEstoque(e.target.value)}
                      min="0"
                      className="input-estoque"
                    />
                  ) : (
                    <span className="estoque-valor">{produto.estoque}</span>
                  )}
                </td>
                <td>
                  {produto.estoque === 0 ? (
                    <span className="status-fora">Fora</span>
                  ) : produto.estoque <= 5 ? (
                    <span className="status-baixo">Baixo</span>
                  ) : (
                    <span className="status-ok">OK</span>
                  )}
                </td>
                <td className="acao-cell">
                  {edicao === produto.id ? (
                    <>
                      <button
                        className="btn-salvar"
                        onClick={() => handleSalvar(produto.id)}
                      >
                        ✓ Salvar
                      </button>
                      <button
                        className="btn-cancelar"
                        onClick={() => setEdicao(null)}
                      >
                        ✗ Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn-editar"
                      onClick={() => handleEditar(produto.id, produto.estoque)}
                    >
                      ✏️ Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
