import { useState } from "react";
import { CreditCard, User, Calendar, Lock } from "lucide-react";
import "./PagamentoCartao.css";

export default function PagamentoCartao({
  valorTotal,
  processando,
  aoFinalizar,
}) {
  const [dados, setDados] = useState({
    nome: "",
    numero: "",
    validade: "",
    cvv: "",
    metodo: "CREDITO",
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
    aoFinalizar(dados);
  };

  return (
    <div className="cartao-container">
      {/* Visual do Cartão Simbólico */}
      <div className={`cartao-visual ${dados.metodo.toLowerCase()}`}>
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
            className={dados.metodo === "CREDITO" ? "active" : ""}
            onClick={() => setDados({ ...dados, metodo: "CREDITO" })}
          >
            Crédito
          </button>
          <button
            type="button"
            className={dados.metodo === "DEBITO" ? "active" : ""}
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
            placeholder="Ex: JOÃO A SILVA"
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

        {dados.metodo === "CREDITO" && (
          <div className="input-box">
            <label>Parcelamento</label>
            <select
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

        <button type="submit" className="btn-pagar" disabled={processando}>
          {processando ? "Processando..." : "Finalizar Pagamento"}
        </button>
      </form>
    </div>
  );
}
