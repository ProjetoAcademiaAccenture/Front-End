import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../auth/context/AuthContext";
import { Copy, CheckCircle2, Printer } from "lucide-react";
import { lojaAPI } from "../../services/lojaAPI";

import "./PagamentoBoleto.css";

export default function PagamentoBoleto({ pedido }) {
  const { setPagamentoConcluido } = useContext(AuthContext);

  const [boleto, setBoleto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const buscarDadosBoleto = async () => {
      try {
        const response = await lojaAPI.getBoletoPorPagamentoId(
          pedido.pagamento.id,
        );
        if (response.status === 200) {
          setBoleto(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar boleto:", error);
      } finally {
        setLoading(false);
      }
    };

    if (pedido?.pagamento?.id) buscarDadosBoleto();
  }, [pedido]);

  const handleCopy = () => {
    navigator.clipboard.writeText(boleto.codigoBarras);
    setCopiado(true);
    setPagamentoConcluido({ id: pedido.pagamento.id, status: "PENDENTE" });
    setTimeout(() => setCopiado(false), 2000);
  };

  if (loading)
    return <div className="loading-simple">Gerando boleto oficial...</div>;
  if (!boleto)
    return <div className="error-simple">Erro ao carregar boleto.</div>;

  return (
    <div className="layout-boleto">
      {/* Botões de Ação Rápidas */}
      <div className="acoes-boleto">
        <button onClick={handleCopy} className="btn-acao">
          {copiado ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          {copiado ? "Copiado!" : "Copiar Linha Digitável"}
        </button>
        <button onClick={() => window.print()} className="btn-acao">
          <Printer size={16} /> Imprimir PDF
        </button>
      </div>

      {/* Estrutura do Boleto Simulado */}
      <div className="boleto-papel">
        <div className="boleto-header">
          <div className="banco-logo">
            ACCENTURE BANK | <span className="banco-cod">001-9</span>
          </div>
          <div className="linha-digitavel">{boleto.codigoBarras}</div>
        </div>

        <div className="boleto-row">
          <div className="boleto-field flex-3">
            <label>Local de Pagamento</label>
            <span>PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO</span>
          </div>
          <div className="boleto-field flex-1 em-destaque">
            <label>Vencimento</label>
            <span>
              {new Date(boleto.dataVencimento).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

        <div className="boleto-row">
          <div className="boleto-field flex-3">
            <label>Beneficiário</label>
            <span>PROJETO FINAL ACCENTURE LTDA - CNPJ: 00.000.000/0001-00</span>
          </div>
          <div className="boleto-field flex-1">
            <label>Agência / Código Beneficiário</label>
            {/* Usando o número da conta vindo do seu DB: 1234567-8 */}
            <span>0001 / 1234567-8</span>
          </div>
        </div>

        <div className="boleto-row">
          <div className="boleto-field">
            <label>Data do Doc.</label>
            <span>
              {new Date(pedido.dataCriacao).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="boleto-field">
            <label>Nº do Documento</label>
            <span>{pedido.id.toString().padStart(6, "0")}</span>
          </div>
          <div className="boleto-field">
            <label>Espécie Doc.</label>
            <span>DM</span>
          </div>
          <div className="boleto-field">
            <label>Aceite</label>
            <span>N</span>
          </div>
          <div className="boleto-field">
            <label>Data Processamento</label>
            <span>{new Date().toLocaleDateString("pt-BR")}</span>
          </div>
          <div className="boleto-field flex-1">
            <label>Nosso Número</label>
            <span>28/0000000{boleto.id}-1</span>
          </div>
        </div>

        <div className="boleto-row">
          <div className="boleto-field flex-3">
            <label>
              Instruções (Texto de Responsabilidade do Beneficiário)
            </label>
            <div className="instrucoes">
              <p>SR. CAIXA, NÃO RECEBER APÓS O VENCIMENTO.</p>
              <p>
                REFERENTE AO PEDIDO #{pedido.id} -{" "}
                {pedido.itens[0]?.produtoNome}
              </p>
              {boleto.multaAtraso > 0 && (
                <p>
                  APÓS VENCIMENTO COBRAR MULTA DE R${" "}
                  {boleto.multaAtraso.toFixed(2)}
                </p>
              )}
              <p>
                DESCONTO JÁ APLICADO NO VALOR TOTAL: R${" "}
                {pedido.desconto.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="boleto-col-valores flex-1">
            <div className="boleto-field-valor">
              <label>(=) Valor do Documento</label>
              <span>
                {boleto.valorTotal.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="boleto-field-valor">
              <label>(-) Desconto / Abatimento</label>
              <span>0,00</span>
            </div>
            <div className="boleto-field-valor">
              <label>(+) Mora / Multa</label>
              <span>
                {boleto.multaAtraso > 0
                  ? boleto.multaAtraso.toFixed(2)
                  : "0,00"}
              </span>
            </div>
            <div className="boleto-field-valor total">
              <label>(=) Valor Cobrado</label>
              <span>
                {boleto.valorTotal.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="boleto-row final">
          <div className="boleto-field">
            <label>Pagador</label>
            <div className="pagador-info">
              <span>CLIENTE ID: {pedido.clienteId}</span>
              <br />
              <span>
                SACADO:{" "}
                {pedido.itens[0]?.produtoNome
                  ? "Comprador de Hardware"
                  : "Cliente Final"}
              </span>
            </div>
          </div>
          <div className="boleto-field cod-baixa">
            <label>Cód. Baixa</label>
          </div>
        </div>

        <div className="codigo-barras-imagem">
          {/* Simulação visual do código de barras real */}
          <div className="bar-placeholder"></div>
          <span>Autenticação Mecânica - Ficha de Compensação</span>
        </div>
      </div>
    </div>
  );
}
