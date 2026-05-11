import { useState, useContext } from "react";
import { useBanco } from "../../hooks/useBanco";
import { BancoContext } from "../../../../context/BancoContext";
import { bancoAPI } from "../../services/bancoAPI";
import Extrato from "../../components/Extrato/Extrato";
import "./BancoDashboard.css";
import { useModuleAuth } from "../../../../auth/hooks/useModuleAuth";

import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ClipboardList,
  Shield,
  DollarSign,
  Check,
  X,
} from 'lucide-react';

export default function BancoDashboard() {
  const { saldo, transacoes } = useBanco();
  const { user } = useModuleAuth("loja");
  const { boletos, atualizarBoleto } = useContext(BancoContext);
  
  const [boletoSelecionado, setBoletoSelecionado] = useState(null);
  const [codigoBarras, setCodigoBarras] = useState("");
  const [processando, setProcessando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const boletosPendentes = boletos.filter((b) => b.status === "PENDENTE");

  const buscarBoletoComCodigo = () => {
    if (codigoBarras.length !== 44) {
      setMensagem("Código de barras deve ter 44 dígitos");
      return;
    }

    const boleto = boletos.find((b) => b.codigoBarras === codigoBarras);
    if (boleto) {
      setBoletoSelecionado(boleto);
      setMensagem("");
    } else {
      setMensagem("Boleto não encontrado");
      setBoletoSelecionado(null);
    }
  };

  const pagarBoleto = async () => {
    if (!boletoSelecionado) {
      setMensagem("Selecione um boleto para pagar");
      return;
    }

    if (saldo < boletoSelecionado.valor) {
      setMensagem("Saldo insuficiente para pagar este boleto");
      return;
    }

    setProcessando(true);
    setMensagem("");

    try {
      const resultado = await bancoAPI.pagarBoleto(boletoSelecionado.id);
      atualizarBoleto(boletoSelecionado.id, { status: "PAGO" });
      setMensagem("Boleto pago com sucesso!");
      setBoletoSelecionado(null);
      setCodigoBarras("");
    } catch (err) {
      setMensagem("Erro ao pagar boleto: " + (err.message || "Erro desconhecido"));
      console.error(err);
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div className="banco-page">
      <div className="page-header">
        <h1>
          <LayoutDashboard size={22} /> Dashboard
        </h1>
        <p className="page-subtitle">Visão geral da sua conta</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Wallet size={20} />
          </div>
          <div className="stat-content">
            <h3>Saldo Total</h3>
            <p className="stat-value">
              R${" "}
              {(saldo ?? 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 size={20} />
          </div>
          <div className="stat-content">
            <h3>Total de Transações</h3>
            <p className="stat-value">{transacoes.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <h3>Créditos</h3>
            <p className="stat-value credito">
              +R${" "}
              {transacoes
                .filter((t) => t.tipo === "credito")
                .reduce((sum, t) => sum + t.valor, 0)
                .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingDown size={20} />
          </div>
          <div className="stat-content">
            <h3>Débitos</h3>
            <p className="stat-value debito">
              -R${" "}
              {transacoes
                .filter((t) => t.tipo === "debito")
                .reduce((sum, t) => sum + t.valor, 0)
                .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Seção de Boletos para Pagar */}
      {boletosPendentes.length > 0 && (
        <div className="boletos-section">
          <div className="boletos-header">
            <h2><DollarSign size={20} /> Boletos para Pagar</h2>
            <span className="badge-boletos">{boletosPendentes.length}</span>
          </div>

          {mensagem && (
            <div
              className={`mensagem ${mensagem.includes("sucesso") ? "sucesso" : "erro"}`}
            >
              {mensagem}
            </div>
          )}

          <div className="boletos-lista">
            {boletosPendentes.map((boleto) => (
              <div
                key={boleto.id}
                className={`boleto-item ${boletoSelecionado?.id === boleto.id ? "selecionado" : ""}`}
                onClick={() => setBoletoSelecionado(boleto)}
              >
                <div className="boleto-info">
                  <div className="boleto-valor-item">
                    R$ {(boleto.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="boleto-detalhes">
                    <span className="boleto-id">ID: {boleto.id}</span>
                    <span className="boleto-vencimento">
                      Vence: {new Date(boleto.dataVencimento).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="boleto-check">
                  {boletoSelecionado?.id === boleto.id && <Check size={20} />}
                </div>
              </div>
            ))}
          </div>

          <div className="boleto-form">
            <h3>Ou Digite o Código de Barras</h3>
            <div className="codigo-input-group">
              <input
                type="text"
                placeholder="Digite os 44 dígitos do código de barras"
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value.replace(/\D/g, "").slice(0, 44))}
                maxLength="44"
                disabled={processando}
              />
              <button
                onClick={buscarBoletoComCodigo}
                disabled={processando || codigoBarras.length === 0}
                className="btn-buscar"
              >
                Buscar
              </button>
            </div>
          </div>

          {boletoSelecionado && (
            <div className="boleto-confirmacao">
              <h3>Confirmar Pagamento</h3>
              <div className="confirmacao-grid">
                <div className="confirmacao-item">
                  <label>Valor:</label>
                  <p>R$ {(boletoSelecionado.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="confirmacao-item">
                  <label>Vencimento:</label>
                  <p>{new Date(boletoSelecionado.dataVencimento).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="confirmacao-item">
                  <label>Código:</label>
                  <p className="codigo-confirmacao">{boletoSelecionado.codigoBarras}</p>
                </div>
              </div>

              {saldo < boletoSelecionado.valor && (
                <div className="aviso-saldo">
                  <X size={18} /> Saldo insuficiente
                </div>
              )}

              <div className="confirmacao-actions">
                <button
                  className="btn-pagar-banco"
                  onClick={pagarBoleto}
                  disabled={processando || saldo < boletoSelecionado.valor}
                >
                  {processando ? "Processando..." : "✓ Pagar Boleto"}
                </button>
                <button
                  className="btn-cancelar"
                  onClick={() => setBoletoSelecionado(null)}
                  disabled={processando}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <Extrato transacoes={transacoes} />

      <div className="info-cards">
        <div className="info-card">
          <h3>
            <ClipboardList size={18} /> Informações da Conta
          </h3>

          <div className="info-item">
            <span className="label">Nome:</span>
            <span className="value">{user?.nome}</span>
          </div>

          <div className="info-item">
            <span className="label">Email:</span>
            <span className="value">{user?.email}</span>
          </div>

          <div className="info-item">
            <span className="label">Conta:</span>
            <span className="value">{user?.conta}</span>
          </div>
        </div>

        <div className="info-card">
          <h3>
            <Shield size={18} /> Segurança
          </h3>

          <button className="btn-secondary">Alterar Senha</button>
          <button className="btn-secondary">Ativar 2FA</button>
        </div>
      </div>
    </div>
  );
}