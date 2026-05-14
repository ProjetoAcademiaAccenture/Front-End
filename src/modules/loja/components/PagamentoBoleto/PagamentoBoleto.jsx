import { useState, useEffect } from "react";
import {
  Copy,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import { lojaAPI } from "../../services/lojaAPI";

export default function PagamentoBoleto({ pedido, processando, aoFinalizar }) {
  const [boleto, setBoleto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLocal, setStatusLocal] = useState("");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const buscarDadosBoleto = async () => {
      try {
        const response = await lojaAPI.getBoletoPorPagamentoId(pedido.pagamento.id);
        console.log("Resposta do boleto:", response);
        if (response.status === 200) {
          setBoleto(response.data);
          setStatusLocal(response.data.status);
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
    setTimeout(() => setCopiado(false), 2000);
  };

  if (loading) return <div className="loading-simple">Gerando boleto...</div>;
  if (!boleto)
    return (
      <div className="error-simple">
        Erro ao carregar informações do boleto.
      </div>
    );

  const estaPago = boleto.status === "PAGO" || statusLocal === "sucesso";

  return (
    <div className="boleto-container">
      <div className="boleto-header-info">
        <div className="info-item">
          <Calendar size={18} />
          <span>
            Vencimento:{" "}
            <strong>
              {new Date(boleto.dataVencimento).toLocaleDateString("pt-BR")}
            </strong>
          </span>
        </div>
        <div className="info-item">
          <DollarSign size={18} />
          <span>
            Valor:{" "}
            <strong>
              R${" "}
              {boleto.valorTotal.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </strong>
          </span>
        </div>
      </div>

      {boleto.atrasado && !estaPago && (
        <div className="alerta-atraso">
          <AlertCircle size={18} />
          <span>
            Boleto vencido. Acréscimo de multa de R${" "}
            {boleto.multaAtraso.toFixed(2)} incluído no total.
          </span>
        </div>
      )}

      <div className="codigo-barras-box">
        <label>Linha Digitável</label>
        <div className="barcode-display">
          <code>{boleto.codigoBarras}</code>
          <button onClick={handleCopy} title="Copiar código">
            {copiado ? (
              <CheckCircle2 size={18} color="#22c55e" />
            ) : (
              <Copy size={18} />
            )}
          </button>
        </div>
      </div>

      <hr />

      <div className="boleto-footer">
        {!boleto && (
          <button
            onClick={() => aoFinalizar({ senhaTransacao: "0000" })}
            disabled={processando}
          >
            {processando ? "Gerando..." : "Gerar Linha Digitável"}
          </button>
        )}
        <p>
          Você também pode pagar este boleto em qualquer banco ou casa lotérica
          até a data de vencimento.
        </p>
      </div>
    </div>
  );
}
