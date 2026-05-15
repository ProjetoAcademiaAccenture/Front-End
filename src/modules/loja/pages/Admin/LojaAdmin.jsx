import React, { useState, useEffect, useCallback, useRef } from 'react';
import { lojaAPI } from '../../services/lojaAPI';
import './LojaAdmin.css';

import {
  UserCog,
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  RefreshCw,
  XCircle,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react';

// ─── Utilitários ────────────────────────────────────────────────────────────

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                     'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function brl(valor) {
  return (valor ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function padId(id) {
  return `#${String(id).padStart(3, '0')}`;
}

// Retorna campo de data do pedido (aceita dataCriacao ou createdAt ou id como fallback)
function datasDoPedido(pedido) {
  return pedido.dataCriacao || pedido.createdAt || null;
}

function agruparPorMes(pedidos, campo = 'count', mesesExibidos = 6) {
  const agora = new Date();
  const resultado = [];
  for (let i = mesesExibidos - 1; i >= 0; i--) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    const mes = d.getMonth();
    const ano = d.getFullYear();
    const doMes = pedidos.filter((p) => {
      const dt = datasDoPedido(p);
      if (!dt) return false;
      const date = new Date(dt);
      return date.getMonth() === mes && date.getFullYear() === ano;
    });
    resultado.push({
      label: `${MESES_ABREV[mes]}/${String(ano).slice(2)}`,
      count: doMes.length,
      valor: doMes
        .filter((p) => p.status === 'PAGO')
        .reduce((s, p) => s + (p.valorFinal ?? 0), 0),
    });
  }
  return resultado;
}

// ─── Componente de Gráfico ──────────────────────────────────────────────────

function GraficoPedidos({ pedidos }) {
  const [aba, setAba] = useState('mensal');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const dadosMensais = agruparPorMes(pedidos, 'count', 6);

  const countStatus = (status) => pedidos.filter((p) => p.status === status).length;
  const pagos = countStatus('PAGO');
  const reservados = countStatus('RESERVADO');
  const cancelados = countStatus('CANCELADO');

  // Destrói gráfico anterior antes de recriar
  const destroyChart = () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;
    // Chart.js deve estar disponível globalmente via CDN ou import externo.
    // Se não estiver, carrega dinamicamente.
    const buildChart = () => {
      const Chart = window.Chart;
      if (!Chart) return;
      destroyChart();
      const ctx = chartRef.current.getContext('2d');
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
      const labelColor = isDark ? '#b4b2a9' : '#888780';

      const baseScales = {
        x: { grid: { color: gridColor }, ticks: { color: labelColor, font: { size: 12 } } },
        y: { grid: { color: gridColor }, ticks: { color: labelColor, font: { size: 12 } } },
      };

      if (aba === 'mensal') {
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: dadosMensais.map((d) => d.label),
            datasets: [{
              label: 'Pedidos',
              data: dadosMensais.map((d) => d.count),
              backgroundColor: '#378ADD',
              borderRadius: 4,
              borderSkipped: false,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: baseScales,
          },
        });
      } else if (aba === 'status') {
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Pago', 'Reservados', 'Cancelado'],
            datasets: [{
              data: [pagos, reservados, cancelados],
              backgroundColor: ['#1D9E75', '#BA7517', '#A32D2D'],
              hoverOffset: 6,
              borderWidth: 2,
              borderColor: isDark ? '#2c2c2a' : '#fff',
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: '65%',
          },
        });
      } else if (aba === 'valor') {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: dadosMensais.map((d) => d.label),
            datasets: [{
              label: 'Faturamento',
              data: dadosMensais.map((d) => d.valor),
              borderColor: '#1D9E75',
              backgroundColor: isDark ? 'rgba(29,158,117,0.15)' : 'rgba(29,158,117,0.08)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: '#1D9E75',
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              ...baseScales,
              y: {
                ...baseScales.y,
                ticks: {
                  ...baseScales.y.ticks,
                  callback: (v) => 'R$' + Math.round(v).toLocaleString('pt-BR'),
                },
              },
            },
          },
        });
      }
    };

    if (window.Chart) {
      buildChart();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
      script.onload = buildChart;
      document.head.appendChild(script);
    }

    return destroyChart;
  }, [aba, pedidos]); // eslint-disable-line react-hooks/exhaustive-deps

  const abas = [
    { key: 'mensal', label: 'Pedidos por mês' },
    { key: 'status', label: 'Por status' },
    { key: 'valor', label: 'Faturamento mensal' },
  ];

  const legendas = {
    mensal: [{ cor: '#378ADD', label: 'Pedidos' }],
    status: [
      { cor: '#1D9E75', label: `Pago (${pagos})` },
      { cor: '#BA7517', label: `Reservado (${reservados})` },
      { cor: '#A32D2D', label: `Cancelado (${cancelados})` },
    ],
    valor: [{ cor: '#1D9E75', label: 'Receita paga' }],
  };

  return (
    <div className="admin-section grafico-section">
      <h2><BarChart3 size={18} /> Análise de Pedidos</h2>

      <div className="grafico-abas">
        {abas.map((a) => (
          <button
            key={a.key}
            className={`grafico-aba ${aba === a.key ? 'ativa' : ''}`}
            onClick={() => setAba(a.key)}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="grafico-legenda">
        {legendas[aba].map((l) => (
          <span key={l.label} className="leg-item">
            <span className="leg-dot" style={{ background: l.cor }} />
            {l.label}
          </span>
        ))}
      </div>

      <div className="grafico-canvas-wrap">
        <canvas ref={chartRef} aria-label="Gráfico de análise de pedidos" role="img" />
      </div>
    </div>
  );
}

// ─── Modal Relatório Completo ────────────────────────────────────────────────

function ModalRelatorio({ pedidos, onFechar }) {
  const total = pedidos.reduce((s, p) => s + (p.valorFinal ?? 0), 0);
  const pagos = pedidos.filter((p) => p.status === 'PAGO');
  const faturado = pagos.reduce((s, p) => s + (p.valorFinal ?? 0), 0);
  const ticket = pagos.length ? faturado / pagos.length : 0;

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><FileText size={18} /> Relatório Completo de Pedidos</h2>
          <button className="modal-fechar" onClick={onFechar}><XCircle size={20} /></button>
        </div>

        <div className="modal-stats">
          <div className="stat-card">
            <h3><CheckCircle size={16} /> Pedidos pagos</h3>
            <p className="valor">{pagos.length}</p>
          </div>
          <div className="stat-card">
            <h3><DollarSign size={16} /> Faturado</h3>
            <p className="valor">R$ {brl(faturado)}</p>
          </div>
          <div className="stat-card">
            <h3><TrendingUp size={16} /> Ticket médio</h3>
            <p className="valor">R$ {brl(ticket)}</p>
          </div>
          <div className="stat-card">
            <h3><ShoppingCart size={16} /> Total geral</h3>
            <p className="valor">R$ {brl(total)}</p>
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => {
                const dt = datasDoPedido(p);
                return (
                  <tr key={p.id}>
                    <td>{padId(p.id)}</td>
                    <td>R$ {brl(p.valorFinal)}</td>
                    <td>
                      <span className={`pedido-status ${p.status.toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>{dt ? new Date(dt).toLocaleDateString('pt-BR') : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Análise de Vendas ─────────────────────────────────────────────────

function ModalAnalise({ pedidos, produtos, onFechar }) {
  const dadosMensais = agruparPorMes(pedidos, 'count', 6);
  const melhorMes = dadosMensais.reduce((a, b) => (b.valor > a.valor ? b : a), dadosMensais[0] || {});

  const porStatus = ['PAGO', 'RESERVADO', 'CANCELADO'].map((s) => {
    const lista = pedidos.filter((p) => p.status === s);
    return {
      status: s,
      count: lista.length,
      valor: lista.reduce((acc, p) => acc + (p.valorFinal ?? 0), 0),
      pct: pedidos.length ? ((lista.length / pedidos.length) * 100).toFixed(1) : 0,
    };
  });

  const corStatus = { PAGO: '#1D9E75', RESERVADO: '#BA7517', CANCELADO: '#A32D2D' };

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-box modal-box--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><BarChart3 size={18} /> Análise de Vendas</h2>
          <button className="modal-fechar" onClick={onFechar}><XCircle size={20} /></button>
        </div>

        <div className="analise-grid">

          <div className="analise-card">
            <p className="analise-label">Melhor mês</p>
            <p className="analise-valor">{melhorMes?.label ?? '—'}</p>
            <p className="analise-sub">R$ {brl(melhorMes?.valor)}</p>
          </div>

          <div className="analise-card">
            <p className="analise-label">Conversão (pago/total)</p>
            <p className="analise-valor">
              {pedidos.length
                ? ((pedidos.filter((p) => p.status === 'PAGO').length / pedidos.length) * 100).toFixed(1)
                : 0}%
            </p>
          </div>

          <div className="analise-card">
            <p className="analise-label">Produtos sem estoque</p>
            <p className="analise-valor" style={{ color: '#A32D2D' }}>
              {produtos.filter((p) => p.quantidadeEstoque === 0).length}
            </p>
          </div>

          <div className="analise-card">
            <p className="analise-label">Produtos com estoque baixo (≤5)</p>
            <p className="analise-valor" style={{ color: '#BA7517' }}>
              {produtos.filter((p) => p.quantidadeEstoque > 0 && p.quantidadeEstoque <= 5).length}
            </p>
          </div>

        </div>

        <h3 className="analise-secao-titulo">Desempenho por status</h3>
        {porStatus.map((s) => (
          <div key={s.status} className="analise-barra-row">
            <span className="analise-barra-label">{s.status}</span>
            <div className="analise-barra-track">
              <div
                className="analise-barra-fill"
                style={{ width: `${s.pct}%`, background: corStatus[s.status] }}
              />
            </div>
            <span className="analise-barra-pct">{s.pct}%</span>
            <span className="analise-barra-valor">R$ {brl(s.valor)}</span>
          </div>
        ))}

        <h3 className="analise-secao-titulo">Faturamento por mês</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Mês</th>
                <th>Pedidos</th>
                <th>Faturamento</th>
              </tr>
            </thead>
            <tbody>
              {dadosMensais.map((d) => (
                <tr key={d.label}>
                  <td>{d.label}</td>
                  <td>{d.count}</td>
                  <td>R$ {brl(d.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Componente Principal ────────────────────────────────────────────────────

export default function LojaAdmin() {
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [cancelando, setCancelando] = useState(null);
  const [modal, setModal] = useState(null); // null | 'relatorio' | 'analise'

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const [listaProdutos, listaPedidos] = await Promise.all([
        lojaAPI.getProdutos(),
        lojaAPI.getPedidosTodos(),
      ]);
      setProdutos(listaProdutos);
      setPedidos(listaPedidos);
    } catch (err) {
      setErro('Erro ao carregar dados. Verifique a conexão com o servidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const mostrarMensagem = (msg) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(''), 3000);
  };

  const handleCancelarPedido = async (pedidoId) => {
    if (!window.confirm(`Deseja cancelar o pedido ${padId(pedidoId)}?`)) return;
    setCancelando(pedidoId);
    setErro('');
    try {
      await lojaAPI.cancelarPedido(pedidoId);
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, status: 'CANCELADO' } : p))
      );
      mostrarMensagem(`Pedido ${padId(pedidoId)} cancelado.`);
    } catch (err) {
      setErro('Erro ao cancelar pedido.');
      console.error(err);
    } finally {
      setCancelando(null);
    }
  };

  const totalVendido = pedidos
    .filter((p) => p.status === 'PAGO')
    .reduce((sum, p) => sum + (p.valorFinal ?? 0), 0);

  const produtosMaisBaixa = [...produtos]
    .sort((a, b) => a.quantidadeEstoque - b.quantidadeEstoque)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="loja-page">
        <div className="loading-state">
          <RefreshCw size={24} className="spin" /> Carregando painel...
        </div>
      </div>
    );
  }

  return (
    <div className="loja-page">

      <div className="page-header">
        <div>
          <h1><UserCog size={22} /> Painel Administrativo</h1>
          <p className="page-subtitle">Dashboard de vendas e gerenciamento</p>
        </div>
        <button className="btn-refresh" onClick={carregarDados} title="Recarregar">
          <RefreshCw size={16} />
        </button>
      </div>

      {mensagem && <div className="alerta-sucesso">✓ {mensagem}</div>}
      {erro && <div className="alerta-erro">⚠ {erro}</div>}

      {/* ── Estatísticas ── */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3><DollarSign size={18} /> Faturamento Total</h3>
          <p className="valor">R$ {brl(totalVendido)}</p>
        </div>
        <div className="stat-card">
          <h3><ShoppingCart size={18} /> Pedidos</h3>
          <p className="valor">{pedidos.length}</p>
        </div>
        <div className="stat-card">
          <h3><Package size={18} /> Produtos</h3>
          <p className="valor">{produtos.length}</p>
        </div>
        <div className="stat-card">
          <h3><BarChart3 size={18} /> Estoque Total</h3>
          <p className="valor">
            {produtos.reduce((sum, p) => sum + (p.quantidadeEstoque ?? 0), 0)} unidades
          </p>
        </div>
      </div>

      {/* ── Conteúdo principal ── */}
      <div className="admin-content">

        {/* Baixo estoque */}
        <div className="admin-section">
          <h2><AlertTriangle size={18} /> Produtos com Baixo Estoque</h2>
          <div className="table-scroll">
            {produtosMaisBaixa.length === 0 ? (
              <p className="empty-state">Nenhum produto encontrado.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Estoque</th>
                    <th>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosMaisBaixa.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td>
                        <span className={
                          p.quantidadeEstoque === 0 ? 'fora'
                          : p.quantidadeEstoque <= 5 ? 'baixo'
                          : 'ok'
                        }>
                          {p.quantidadeEstoque}
                        </span>
                      </td>
                      <td>R$ {brl(p.preco)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Últimos pedidos */}
        <div className="admin-section">
          <h2><FileText size={18} /> Últimos Pedidos</h2>
          <div className="table-scroll">
            {pedidos.length === 0 ? (
              <p className="empty-state">Nenhum pedido encontrado.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.slice(0, 5).map((pedido) => (
                    <tr key={pedido.id}>
                      <td>{padId(pedido.id)}</td>
                      <td>R$ {brl(pedido.valorFinal)}</td>
                      <td>
                        <span className={`pedido-status ${pedido.status.toLowerCase()}`}>
                          {pedido.status}
                        </span>
                      </td>
                      <td>
                        {pedido.status !== 'CANCELADO' && (
                          <button
                            className="btn-deletar"
                            title="Cancelar pedido"
                            disabled={cancelando === pedido.id}
                            onClick={() => handleCancelarPedido(pedido.id)}
                          >
                            <XCircle size={14} />
                            {cancelando === pedido.id ? ' Cancelando...' : ' Cancelar'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* ── Gráfico integrado ── */}
      {pedidos.length > 0 && (
        <GraficoPedidos pedidos={pedidos} />
      )}

      {/* ── Ações ── */}
      <div className="admin-actions">
        <button className="btn-admin" onClick={() => setModal('relatorio')}>
          <FileText size={16} /> Relatório Completo
        </button>
        <button className="btn-admin" onClick={() => setModal('analise')}>
          <BarChart3 size={16} /> Análise de Vendas
        </button>
        <button className="btn-admin">
          <Settings size={16} /> Configurações
        </button>
      </div>

      {/* ── Modais ── */}
      {modal === 'relatorio' && (
        <ModalRelatorio pedidos={pedidos} onFechar={() => setModal(null)} />
      )}
      {modal === 'analise' && (
        <ModalAnalise pedidos={pedidos} produtos={produtos} onFechar={() => setModal(null)} />
      )}

    </div>
  );
}