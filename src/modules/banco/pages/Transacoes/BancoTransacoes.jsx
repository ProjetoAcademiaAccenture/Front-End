import { useContext, useState } from "react";
import { useBanco } from "../../hooks/useBanco";
import { bancoAPI } from "../../services/bancoAPI";
import Extrato from "../../components/Extrato/Extrato";
import { AuthContext } from "../../../../auth/context/AuthContext";

import {
  List,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  ArrowRightLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  QrCode,
} from "lucide-react";

import "./BancoTransacoes.css";
import { PiX } from "react-icons/pi";

export default function BancoTransacoes() {
  const { transacoes, carregarDados } = useBanco();
  const { pagamentoConcluido, confirmarPagamentoGlobal } =
    useContext(AuthContext);

  const [aba, setAba] = useState("historico"); // 'historico' | 'pix' | 'boleto' | 'transferencia'
  const [senhaTransacao, setSenhaTransacao] = useState("");

  // --- Pix ---
  const [pix, setPix] = useState("");
  const [pixErro, setPixErro] = useState("");
  const [pixLoading, setPixLoading] = useState(false);
  const [pixSucesso, setPixSucesso] = useState(false);

  // --- Boleto ---
  const [boletoId, setBoletoId] = useState("");
  const [boletoDados, setBoletoDados] = useState(null);
  const [boletoErro, setBoletoErro] = useState("");
  const [boletoLoading, setBoletoLoading] = useState(false);
  const [boletoPago, setBoletoPago] = useState(false);

  // --- Transferência ---
  const [transContaDestino, setTransContaDestino] = useState("");
  const [transValor, setTransValor] = useState("");
  const [transDescricao, setTransDescricao] = useState("");
  const [transErro, setTransErro] = useState("");
  const [transLoading, setTransLoading] = useState(false);
  const [transSucesso, setTransSucesso] = useState(false);

  const transacoesCreditadas = transacoes.filter(
    (t) => t.tipo === "CREDITO" || t.tipo === "ESTORNO",
  );
  const transacoesDebito = transacoes.filter(
    (t) => t.tipo === "DEBITO" || t.tipo === "MULTA",
  );

  // --- Handlers Pix ---
  const handlePagarPix = async (e) => {
    e.preventDefault();
    setPixErro("");
    setPixSucesso(false);
    if (!pix.trim()) {
      setPixErro("Informe o código Pix.");
      return;
    }
    if (!pagamentoConcluido?.id) {
      setPixErro(
        "Nenhum pagamento pendente encontrado. Inicie um pagamento na loja.",
      );
      return;
    }
    if (!senhaTransacao.trim()) {
      setPixErro("Informe a senha da transação.");
      return;
    }

    const payload = {
      pagamentoId: pagamentoConcluido.id,
      metodoPagamento: "PIX",
      senhaTransacao: senhaTransacao,
    };
    setPixLoading(true);
    try {
      const resposne = await bancoAPI.processarPagamento(payload);
      console.log("Resposta do pagamento Pix:", resposne);
      setPixSucesso(true);
      confirmarPagamentoGlobal(pagamentoConcluido.id, "APROVADO");
      await carregarDados();
    } catch (error) {
      setPixErro("Erro ao processar pagamento Pix.");
    } finally {
      setPixLoading(false);
    }
  };

  // --- Handlers Boleto ---
  const handleBuscarBoleto = async (e) => {
    e.preventDefault();
    setBoletoErro("");
    setBoletoDados(null);
    setBoletoPago(false);

    if (!boletoId.trim()) {
      setBoletoErro("Informe o código do boleto.");
      return;
    }

    setBoletoLoading(true);
    try {
      const boleto = await bancoAPI.getBoleto(boletoId.trim());
      setBoletoDados(boleto);
    } catch (err) {
      setBoletoErro("Boleto não encontrado. Verifique o código.");
    } finally {
      setBoletoLoading(false);
    }
  };

  const handlePagarBoleto = async () => {
    setBoletoLoading(true);
    setBoletoErro("");
    try {
      await bancoAPI.pagarBoleto(boletoDados.id);
      setBoletoPago(true);
      setBoletoDados((prev) => ({ ...prev, status: "PAGO" }));
      await carregarDados();
    } catch (err) {
      setBoletoErro(err.response?.data?.message || "Erro ao pagar boleto.");
    } finally {
      setBoletoLoading(false);
    }
  };

  const handleNovaConsulta = () => {
    setBoletoId("");
    setBoletoDados(null);
    setBoletoErro("");
    setBoletoPago(false);
  };

  // --- Handlers Transferência ---
  const handleTransferencia = async (e) => {
    e.preventDefault();
    setTransErro("");
    setTransSucesso(false);

    if (!transContaDestino.trim() || !transValor) {
      setTransErro("Preencha todos os campos obrigatórios.");
      return;
    }

    const valor = parseFloat(transValor);
    if (valor <= 0) {
      setTransErro("Informe um valor válido.");
      return;
    }

    setTransLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("banco_user"));
      await bancoAPI.transferir(user.contaId, {
        contaDestino: transContaDestino.trim(),
        valor,
        descricao: transDescricao || "Transferência",
      });
      setTransSucesso(true);
      setTransContaDestino("");
      setTransValor("");
      setTransDescricao("");
      await carregarDados();
      setTimeout(() => setTransSucesso(false), 3000);
    } catch (err) {
      setTransErro(
        err.response?.data?.message || "Erro ao realizar transferência.",
      );
    } finally {
      setTransLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === "PAGO") return "credito";
    if (status === "CANCELADO") return "debito";
    return "pendente";
  };

  return (
    <div className="banco-page">
      <div className="page-header">
        <h1>
          <List size={22} /> Transações
        </h1>
        <p className="page-subtitle">Histórico e operações</p>
      </div>

      {/* Abas */}
      <div className="transacoes-abas">
        <button
          className={`aba-btn ${aba === "historico" ? "ativa" : ""}`}
          onClick={() => setAba("historico")}
        >
          <Activity size={16} /> Histórico
        </button>
        <button
          className={`aba-btn ${aba === "pix" ? "ativa" : ""}`}
          onClick={() => setAba("pix")}
        >
          <QrCode size={16} /> Pagar Pix
        </button>
        <button
          className={`aba-btn ${aba === "boleto" ? "ativa" : ""}`}
          onClick={() => setAba("boleto")}
        >
          <FileText size={16} /> Pagar Boleto
        </button>
        <button
          className={`aba-btn ${aba === "transferencia" ? "ativa" : ""}`}
          onClick={() => setAba("transferencia")}
        >
          <ArrowRightLeft size={16} /> Transferência
        </button>
      </div>

      {/* Histórico */}
      {aba === "historico" && (
        <div className="transacoes-container">
          <Extrato transacoes={transacoes} />
          <div className="transacoes-stats">
            <div className="stat-box">
              <h3>
                <TrendingUp size={18} /> Créditos
              </h3>
              <p className="valor credito">
                +R${" "}
                {transacoesCreditadas
                  .reduce((sum, t) => sum + t.valor, 0)
                  .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p className="quantidade">
                {transacoesCreditadas.length} transações
              </p>
            </div>
            <div className="stat-box">
              <h3>
                <TrendingDown size={18} /> Débitos
              </h3>
              <p className="valor debito">
                -R${" "}
                {transacoesDebito
                  .reduce((sum, t) => sum + t.valor, 0)
                  .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p className="quantidade">{transacoesDebito.length} transações</p>
            </div>
            <div className="stat-box">
              <h3>
                <Activity size={18} /> Total
              </h3>
              <p className="valor">{transacoes.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pix */}
      {aba === "pix" && (
        <div className="operacao-card">
          <h2>
            <QrCode size={18} /> Pagamento via Pix
          </h2>
          {pixSucesso && (
            <div className="success-alert">
              <CheckCircle size={16} /> Pagamento Pix aprovado!
            </div>
          )}
          {pixErro && (
            <div className="error-alert">
              <AlertCircle size={16} /> {pixErro}
            </div>
          )}

          <form onSubmit={handlePagarPix} className="operacao-form">
            <div className="form-group">
              <label>Código Pix</label>
              <input
                type="text"
                value={pix}
                onChange={(e) => setPix(e.target.value)}
                placeholder="Digite o código Pix"
                disabled={pixLoading}
              />
            </div>
            <div className="form-group">
              <label>Senha de Transação</label>
              <input
                type="password"
                value={senhaTransacao}
                maxLength={4}
                onChange={(e) => setSenhaTransacao(e.target.value)}
                placeholder="Digite sua senha de transação"
                disabled={pixLoading}
              />
            </div>
            <button
              type="submit"
              onSubmit={(e) => handlePagarPix(e)}
              className="btn-depositar"
              disabled={
                pixLoading && !pix?.length > 0 && !senhaTransacao.length > 0
              }
            >
              {pixLoading ? (
                <>
                  <Loader2 size={16} className="spin" /> Processando...
                </>
              ) : (
                "Pagar Pix"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Boleto */}
      {aba === "boleto" && (
        <div className="operacao-card">
          <h2>
            <FileText size={18} /> Pagamento de Boleto
          </h2>

          {!boletoDados ? (
            <form onSubmit={handleBuscarBoleto} className="operacao-form">
              <div className="form-group">
                <label>Código do Boleto</label>
                <input
                  type="text"
                  value={boletoId}
                  onChange={(e) => setBoletoId(e.target.value)}
                  placeholder="Digite o código do boleto"
                  disabled={boletoLoading}
                />
              </div>
              {boletoErro && (
                <div className="error-alert">
                  <AlertCircle size={16} /> {boletoErro}
                </div>
              )}
              <button
                type="submit"
                className="btn-depositar"
                disabled={boletoLoading}
              >
                {boletoLoading ? (
                  <>
                    <Loader2 size={16} className="spin" /> Buscando...
                  </>
                ) : (
                  "Buscar Boleto"
                )}
              </button>
            </form>
          ) : (
            <div className="boleto-detalhes">
              {boletoPago && (
                <div className="success-alert">
                  <CheckCircle size={16} /> Boleto pago com sucesso!
                </div>
              )}
              {boletoErro && (
                <div className="error-alert">
                  <AlertCircle size={16} /> {boletoErro}
                </div>
              )}

              <div className="boleto-card">
                <h3>Detalhes do Boleto</h3>

                <div className="boleto-row">
                  <span className="label">Código:</span>
                  <span className="value codigo-barras">
                    {boletoDados.codigoBarras}
                  </span>
                </div>
                <div className="boleto-row">
                  <span className="label">Valor:</span>
                  <span className="value valor-destaque">
                    R${" "}
                    {parseFloat(boletoDados.valor).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="boleto-row">
                  <span className="label">Vencimento:</span>
                  <span className="value">
                    {new Date(boletoDados.dataVencimento).toLocaleDateString(
                      "pt-BR",
                    )}
                  </span>
                </div>
                <div className="boleto-row">
                  <span className="label">Status:</span>
                  <span
                    className={`value status-badge ${statusColor(boletoDados.status)}`}
                  >
                    {boletoDados.status}
                  </span>
                </div>
                <div className="boleto-row">
                  <span className="label">Pedido:</span>
                  <span className="value">#{boletoDados.pedidoId}</span>
                </div>
              </div>

              <div className="boleto-acoes">
                {boletoDados.status === "PENDENTE" && !boletoPago && (
                  <button
                    className="btn-depositar"
                    onClick={handlePagarBoleto}
                    disabled={boletoLoading}
                  >
                    {boletoLoading ? (
                      <>
                        <Loader2 size={16} className="spin" /> Processando...
                      </>
                    ) : (
                      `Pagar R$ ${parseFloat(boletoDados.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                    )}
                  </button>
                )}
                <button className="btn-secondary" onClick={handleNovaConsulta}>
                  Nova Consulta
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transferência */}
      {aba === "transferencia" && (
        <div className="operacao-card">
          <h2>
            <ArrowRightLeft size={18} /> Transferência
          </h2>

          {transSucesso && (
            <div className="success-alert">
              <CheckCircle size={16} /> Transferência realizada com sucesso!
            </div>
          )}
          {transErro && (
            <div className="error-alert">
              <AlertCircle size={16} /> {transErro}
            </div>
          )}

          <form onSubmit={handleTransferencia} className="operacao-form">
            <div className="form-group">
              <label>Conta de Destino *</label>
              <input
                type="text"
                value={transContaDestino}
                onChange={(e) => setTransContaDestino(e.target.value)}
                placeholder="Número da conta destino"
                disabled={transLoading}
              />
            </div>
            <div className="form-group">
              <label>Valor (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={transValor}
                onChange={(e) => setTransValor(e.target.value)}
                placeholder="0,00"
                disabled={transLoading}
              />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <input
                type="text"
                value={transDescricao}
                onChange={(e) => setTransDescricao(e.target.value)}
                placeholder="Opcional"
                disabled={transLoading}
              />
            </div>
            <button
              type="submit"
              className="btn-depositar"
              disabled={transLoading}
            >
              {transLoading ? (
                <>
                  <Loader2 size={16} className="spin" /> Processando...
                </>
              ) : (
                "Transferir"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
