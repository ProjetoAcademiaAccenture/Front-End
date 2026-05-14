// pages/Estoque/LojaEstoque.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { lojaAPI } from '../../services/lojaAPI';
import './LojaEstoque.css';

import {
  BarChart3,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  RefreshCw,
} from 'lucide-react';

// Campos internos do formulário (nomes amigáveis para o estado local)
const PRODUTO_VAZIO = {
  nome: '',
  descricao: '',
  preco: '',
  estoque: '',     // armazenado como string no form; mapeado para quantidadeEstoque no envio
  categoria: '',
  imagem: '',      // mapeado para urlImagem no envio
};

export default function LojaEstoque() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  // edição de estoque inline
  const [edicaoEstoque, setEdicaoEstoque] = useState(null);
  const [novoEstoque, setNovoEstoque] = useState('');

  // modal criar/editar produto
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);
  const [formProduto, setFormProduto] = useState(PRODUTO_VAZIO);
  const [salvando, setSalvando] = useState(false);

  // ── Carregar produtos da API ──────────────────────────────────────────────

  const carregarProdutos = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const data = await lojaAPI.getProdutos();
      setProdutos(data);
    } catch (err) {
      setErro('Erro ao carregar produtos. Verifique a conexão com o servidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  // ── Feedback ──────────────────────────────────────────────────────────────

  const mostrarMensagem = (msg) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(''), 3000);
  };

  // ── Estoque inline ────────────────────────────────────────────────────────

  const handleEditarEstoque = (id, estoqueAtual) => {
    setEdicaoEstoque(id);
    setNovoEstoque(String(estoqueAtual));
  };

  const handleSalvarEstoque = async (id) => {
    const quantidade = parseInt(novoEstoque, 10);
    if (isNaN(quantidade) || quantidade < 0) return;
    try {
      const atualizado = await lojaAPI.ajustarEstoque(id, quantidade);
      setProdutos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, quantidadeEstoque: atualizado.quantidadeEstoque } : p
        )
      );
      setEdicaoEstoque(null);
      mostrarMensagem('Estoque atualizado com sucesso!');
    } catch (err) {
      setErro('Erro ao atualizar estoque.');
      console.error(err);
    }
  };

  // ── Modal criar / editar produto ──────────────────────────────────────────

  const abrirModalCriar = () => {
    setProdutoEmEdicao(null);
    setFormProduto(PRODUTO_VAZIO);
    setModalAberto(true);
  };

  const abrirModalEditar = (produto) => {
    setProdutoEmEdicao(produto.id);
    setFormProduto({
      nome: produto.nome,
      descricao: produto.descricao ?? '',
      preco: String(produto.preco),
      estoque: String(produto.quantidadeEstoque),  // API → quantidadeEstoque
      categoria: produto.categoria,
      imagem: produto.urlImagem ?? '',             // API → urlImagem
    });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setProdutoEmEdicao(null);
    setFormProduto(PRODUTO_VAZIO);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormProduto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvarProduto = async () => {
    const { nome, preco, estoque, categoria } = formProduto;
    if (!nome || !preco || !estoque || !categoria) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    // Mapeia os campos do form para os nomes que a API espera
    const dto = {
      nome: formProduto.nome.trim(),
      descricao: formProduto.descricao.trim(),
      preco: parseFloat(formProduto.preco),
      quantidadeEstoque: parseInt(formProduto.estoque, 10),  // form: estoque → API: quantidadeEstoque
      categoria: formProduto.categoria.trim().toUpperCase(),
      urlImagem: formProduto.imagem.trim(),                  // form: imagem  → API: urlImagem
    };

    setSalvando(true);
    setErro('');
    try {
      if (produtoEmEdicao) {
        const atualizado = await lojaAPI.atualizarProduto(produtoEmEdicao, dto);
        setProdutos((prev) =>
          prev.map((p) => (p.id === produtoEmEdicao ? atualizado : p))
        );
        mostrarMensagem('Produto atualizado com sucesso!');
      } else {
        const criado = await lojaAPI.criarProduto(dto);
        setProdutos((prev) => [...prev, criado]);
        mostrarMensagem('Produto criado com sucesso!');
      }
      fecharModal();
    } catch (err) {
      setErro('Erro ao salvar produto. Verifique os dados e tente novamente.');
      console.error(err);
    } finally {
      setSalvando(false);
    }
  };

  // ── Deletar ───────────────────────────────────────────────────────────────

  const handleDeletar = async (id, nome) => {
    if (!window.confirm(`Deseja remover "${nome}" do catálogo?`)) return;
    try {
      await lojaAPI.deletarProduto(id);
      setProdutos((prev) => prev.filter((p) => p.id !== id));
      mostrarMensagem('Produto removido.');
    } catch (err) {
      setErro('Erro ao remover produto.');
      console.error(err);
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────

  const totalEstoque = produtos.reduce((sum, p) => sum + (p.quantidadeEstoque ?? 0), 0);
  const produtosBaixoEstoque = produtos.filter((p) => p.quantidadeEstoque > 0 && p.quantidadeEstoque <= 5);
  const produtosFora = produtos.filter((p) => p.quantidadeEstoque === 0);

  const getStatusClass = (qtd) => {
    if (qtd === 0) return 'fora';
    if (qtd <= 5) return 'baixo';
    return 'ok';
  };

  const getStatusDisplay = (qtd) => {
    if (qtd === 0)
      return <span className="status-fora"><XCircle size={14} /> Fora</span>;
    if (qtd <= 5)
      return <span className="status-baixo"><AlertTriangle size={14} /> Baixo</span>;
    return <span className="status-ok"><CheckCircle size={14} /> OK</span>;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="loja-page">

      <div className="page-header">
        <div>
          <h1><BarChart3 size={22} /> Gerenciar Estoque</h1>
          <p className="page-subtitle">Controle de inventário e produtos</p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={carregarProdutos} title="Recarregar">
            <RefreshCw size={16} />
          </button>
          <button className="btn-novo-produto" onClick={abrirModalCriar}>
            <Plus size={16} /> Novo Produto
          </button>
        </div>
      </div>

      {mensagem && <div className="alerta-sucesso">✓ {mensagem}</div>}
      {erro && (
        <div className="alerta-erro">
          ⚠ {erro}
          <button onClick={() => setErro('')}><X size={14} /></button>
        </div>
      )}

      <div className="estoque-stats">
        <div className="stat-card">
          <h3><Package size={18} /> Total em Estoque</h3>
          <p className="valor">{totalEstoque}</p>
        </div>
        <div className="stat-card">
          <h3><Package size={18} /> Produtos</h3>
          <p className="valor">{produtos.length}</p>
        </div>
        <div className="stat-card alerta">
          <h3><AlertTriangle size={18} /> Baixo Estoque</h3>
          <p className="valor">{produtosBaixoEstoque.length}</p>
        </div>
        <div className="stat-card critico">
          <h3><XCircle size={18} /> Fora de Estoque</h3>
          <p className="valor">{produtosFora.length}</p>
        </div>
      </div>

      <div className="estoque-table">
        {loading ? (
          <div className="loading-state">
            <RefreshCw size={24} className="spin" /> Carregando produtos...
          </div>
        ) : produtos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum produto cadastrado.{' '}
              <button className="link-btn" onClick={abrirModalCriar}>
                Criar primeiro produto
              </button>
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} className={`status-${getStatusClass(produto.quantidadeEstoque)}`}>
                  <td>{produto.nome}</td>
                  <td>{produto.categoria}</td>
                  <td>
                    R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td>
                    {edicaoEstoque === produto.id ? (
                      <input
                        type="number"
                        value={novoEstoque}
                        onChange={(e) => setNovoEstoque(e.target.value)}
                        min="0"
                        className="input-estoque"
                        autoFocus
                      />
                    ) : (
                      <span>{produto.quantidadeEstoque}</span>
                    )}
                  </td>

                  <td>{getStatusDisplay(produto.quantidadeEstoque)}</td>

                  <td>
                    <div className="acao-cell">
                      {edicaoEstoque === produto.id ? (
                        <>
                          <button className="btn-salvar" onClick={() => handleSalvarEstoque(produto.id)}>
                            <Save size={14} /> Salvar
                          </button>
                          <button className="btn-cancelar" onClick={() => setEdicaoEstoque(null)}>
                            <X size={14} /> Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn-editar"
                            title="Ajustar estoque"
                            onClick={() => handleEditarEstoque(produto.id, produto.quantidadeEstoque)}
                          >
                            <Edit size={14} /> Estoque
                          </button>
                          <button
                            className="btn-editar-produto"
                            title="Editar produto"
                            onClick={() => abrirModalEditar(produto)}
                          >
                            <Edit size={14} /> Produto
                          </button>
                          <button
                            className="btn-deletar"
                            title="Remover produto"
                            onClick={() => handleDeletar(produto.id, produto.nome)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalAberto && (
        <div
          className="modal-overlay"
          onClick={fecharModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-titulo"
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho */}
            <div className="modal-header">
              <div className="modal-header-left">
                <Package size={18} />
                <h2 id="modal-titulo">
                  {produtoEmEdicao ? 'Editar produto' : 'Novo produto'}
                </h2>
              </div>
              <button className="btn-fechar-modal" onClick={fecharModal} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            {/* Alerta de erro */}
            {erro && (
              <div className="modal-alerta-erro">
                <span>{erro}</span>
                <button onClick={() => setErro('')} aria-label="Fechar alerta">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Corpo */}
            <div className="modal-body">
              <div className="form-row">
                <label>Nome *</label>
                <input
                  type="text"
                  name="nome"
                  value={formProduto.nome}
                  onChange={handleFormChange}
                  placeholder="Nome do produto"
                  autoFocus
                />
              </div>

              <div className="form-row">
                <label>Descrição</label>
                <textarea
                  name="descricao"
                  value={formProduto.descricao}
                  onChange={handleFormChange}
                  placeholder="Descrição do produto"
                  rows={2}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-row">
                  <label>Preço (R$) *</label>
                  <input
                    type="number"
                    name="preco"
                    value={formProduto.preco}
                    onChange={handleFormChange}
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-row">
                  <label>Estoque *</label>
                  <input
                    type="number"
                    name="estoque"
                    value={formProduto.estoque}
                    onChange={handleFormChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <label>Categoria *</label>
                <input
                  type="text"
                  name="categoria"
                  value={formProduto.categoria}
                  onChange={handleFormChange}
                  placeholder="Ex: ELETRONICOS, ROUPAS..."
                />
              </div>

              <div className="form-row">
                <label>URL da imagem</label>
                <input
                  type="text"
                  name="imagem"
                  value={formProduto.imagem}
                  onChange={handleFormChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Rodapé */}
            <div className="modal-footer">
              <button
                className="btn-cancelar-modal"
                onClick={fecharModal}
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                className="btn-salvar-modal"
                onClick={handleSalvarProduto}
                disabled={salvando}
              >
                <Save size={14} />
                {salvando
                  ? 'Salvando...'
                  : produtoEmEdicao
                  ? 'Salvar alterações'
                  : 'Criar produto'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}