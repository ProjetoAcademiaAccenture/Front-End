import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle2, Timer, ExternalLink } from "lucide-react";

import "./PagamentoPix.css";
import { AuthContext } from "../../../../auth/context/AuthContext";

export default function PagamentoPix({ pedido }) {
  const { setPagamentoConcluido } = useContext(AuthContext);

  const [copiado, setCopiado] = useState(false);

  const gerarPayloadPix = () => {
    const chave = "sua-chave-pix@email.com";
    const valor = pedido.valorFinal.toFixed(2);
    const txid = pedido.pagamento.id;

    // String simulando o padrão Pix
    return `00020101021126580014br.gov.bcb.pix0114${chave}520400005303986540${valor.length}${valor}5802BR5918LOJA_ACCENTURE6006RECIFE62110507${txid}6304`;
  };

  const pixPayload = gerarPayloadPix();

  const handleCopy = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiado(true);
    setPagamentoConcluido({ id: pedido.pagamento.id, status: "PENDENTE" });
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="pix-payment-box">
      <div className="pix-header">
        <Timer className="icon-timer" />
        <span>Aguardando pagamento no app do banco...</span>
      </div>

      <div className="qr-code-section">
        <div className="qr-code-wrapper">
          <QRCodeSVG value={pixPayload} size={200} />
        </div>
      </div>

      <div className="copia-cola-section">
        <label htmlFor="pix-payload">Utilize o Pix Copia e Cola</label>
        <div className="input-group">
          <input id="pix-payload" type="text" readOnly value={pixPayload} />
          <button onClick={handleCopy} className={copiado ? "success" : ""}>
            {copiado ? <CheckCircle2 size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <div className="banco-redirect-info">
        <p>
          <ExternalLink size={16} />
          Copie o código acima e realize o pagamento no{" "}
          <strong>Módulo do Banco</strong>.
        </p>
      </div>
    </div>
  );
}

PagamentoPix.propTypes = {
  pedido: PropTypes.shape({
    valorFinal: PropTypes.number.isRequired,
    pagamento: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
