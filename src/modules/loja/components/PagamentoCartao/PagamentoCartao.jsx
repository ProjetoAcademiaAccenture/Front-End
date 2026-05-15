import { useState } from "react";
import PropTypes from "prop-types";
import { CreditCard, User, Calendar, Lock } from "lucide-react";
import "./PagamentoCartao.css";

export default function PagamentoCartao({
  valorTotal,
  metodoSelecionado,
  processando,
  aoFinalizar,
}) {
  const [metodo] = useState(metodoSelecionado);
  const [dados, setDados] = useState({
    nome: "",
    numero: "",
    validade: "",
    cvv: "",
    parcelas: "1",
    senhaTransacao: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "numero") {
      value = value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    if (name === "validade") {
      value = value.replace(/\D/g, "").replace(/(\d{2})(?=\d)/g, "$1/");
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "");
    }

    setDados({ ...dados, [name]: value.toUpperCase() });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const numeroLimpo = dados.numero.replace(/\s/g, "");
    if (numeroLimpo.length !== 16) {
      alert("Número de cartão inválido. Ele deve conter 16 dígitos.");
      return;
    }

    const validadeRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    if (!validadeRegex.test(dados.validade)) {
      alert(
        "Formato de data de validade inválido. Use o padrão MM/AA (Ex: 08/29).",
      );
      return;
    }

    const [mes, ano] = dados.validade.split("/").map(Number);
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear() % 100; // Pega os últimos 2 dígitos (Ex: 2026 -> 26)
    const mesAtual = dataAtual.getMonth() + 1; // getMonth vai de 0 a 11

    if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
      alert("O cartão informado está vencido!");
      return;
    }

    if (dados.cvv.length !== 3) {
      alert("O código de segurança (CVV) deve conter exatamente 3 dígitos.");
      return;
    }

    if (dados.senhaTransacao.length !== 4) {
      alert("A senha de transação bancária precisa ter 4 dígitos.");
      return;
    }

    aoFinalizar(dados);
  };

  return (
    <div className="cartao-container">
      {/* Visual do Cartão Simbólico */}
      <div className={`cartao-visual ${metodo.toLowerCase()}`}>
        <div className="cartao-chip" />
        <div className="cartao-numero-display">
          {dados.numero || "**** **** **** ****"}
        </div>
        <div className="cartao-footer-display">
          <div className="label-group">
            <span>Titular</span>
            <p>{dados.nome || "NOME NO CARTÃO"}</p>
          </div>
          <div className="label-group">
            <span>Validade</span>
            <p>{dados.validade || "MM/AA"}</p>
          </div>
        </div>
        <div className="bandeira-logo">VISA/MC</div>
      </div>

      <form onSubmit={handleSubmit} className="form-cartao">
        <div className="metodo-selector">
          <button
            type="button"
            className={metodo === "CREDITO" ? "active" : ""}
            onClick={() => setDados({ ...dados, metodo: "CREDITO" })}
          >
            Crédito
          </button>
          <button
            type="button"
            className={metodo === "DEBITO" ? "active" : ""}
            onClick={() => setDados({ ...dados, metodo: "DEBITO" })}
          >
            Débito
          </button>
        </div>

        <div className="input-box">
          <label>
            <User size={14} /> Nome impresso no cartão
          </label>
          <input
            type="text"
            name="nome"
            placeholder="Ex: Ximira Xelo"
            value={dados.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-box">
          <label>
            <CreditCard size={14} /> Número do cartão
          </label>
          <input
            type="text"
            name="numero"
            placeholder="0000 0000 0000 0000"
            maxLength="19"
            value={dados.numero}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-row">
          <div className="input-box">
            <label>
              <Calendar size={14} /> Validade
            </label>
            <input
              type="text"
              name="validade"
              placeholder="MM/AA"
              maxLength="5"
              value={dados.validade}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <label>
              <Lock size={14} /> CVV
            </label>
            <input
              type="text"
              name="cvv"
              placeholder="123"
              maxLength="3"
              value={dados.cvv}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {metodo === "CREDITO" && (
          <div className="input-box">
            <label htmlFor="parcelas">Parcelamento</label>
            <select
              id="parcelas"
              name="parcelas"
              value={dados.parcelas}
              onChange={(e) => setDados({ ...dados, parcelas: e.target.value })}
            >
              <option value="1">
                1x de R$ {valorTotal.toFixed(2)} (Sem juros)
              </option>
              <option value="2">2x de R$ {(valorTotal / 2).toFixed(2)}</option>
              <option value="3">3x de R$ {(valorTotal / 3).toFixed(2)}</option>
            </select>
          </div>
        )}

        <div className="input-box">
          <label>
            <Lock size={14} /> Senha de Transação (4 dígitos)
          </label>
          <input
            type="password"
            name="senhaTransacao"
            placeholder="****"
            maxLength="4"
            value={dados.senhaTransacao}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-pagar"
          disabled={
            processando ||
            dados.nome.trim().length < 3 ||
            dados.numero.length < 12 ||
            dados.validade.length !== 5 ||
            dados.cvv.length !== 3 ||
            dados.senhaTransacao.length !== 4
          }
        >
          {processando ? "Processando..." : "Finalizar Pagamento"}
        </button>
      </form>
    </div>
  );
}

PagamentoCartao.propTypes = {
  valorTotal: PropTypes.number.isRequired,
  metodoSelecionado: PropTypes.string.isRequired,
  processando: PropTypes.bool.isRequired,
  aoFinalizar: PropTypes.func.isRequired,
};
