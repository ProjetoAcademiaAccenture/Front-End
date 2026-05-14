import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle2, Timer } from "lucide-react";
import { useState } from "react";

export default function PagamentoPix({ pedido, processando, aoFinalizar }) {
  const [copiado, setCopiado] = useState(false);
  const [senha, setSenha] = useState("");
  const [mesagem, setMensagem] = useState("");

  const confirmarPagamento = () => {
    if (senha.length !== 4) {
      setMensagem("A senha deve ter 4 dígitos.");
      return;
    }
    aoFinalizar({ senhaTransacao: senha });
  };

  // Simulação de uma string Pix (EMV QR Code)
  const gerarPayloadPix = () => {
    const chave = "sua-chave-pix@email.com";
    const beneficiario = "Sua Loja Accenture";
    const cidade = "RECIFE";
    const valor = pedido.valorFinal.toFixed(2);
    const txid = `PEDIDO${pedido.id}`;

    // String simplificada para simulação (não funcional para bancos reais)
    return `00020101021126580014br.gov.bcb.pix0114${chave}520400005303986540${valor.length}${valor}5802BR5918${beneficiario}6006${cidade}62110507${txid}6304`;
  };

  const pixPayload = gerarPayloadPix();

  const handleCopy = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="pix-payment-box">
      <div className="pix-header">
        <Timer className="icon-timer" />
        <span>Aguardando pagamento... O pedido expira em 30 minutos.</span>
      </div>
      <div className="qr-code-section">
        {/* O componente QRCodeSVG gera o código baseado na string enviada */}
        <div className="qr-code-wrapper">
          <QRCodeSVG
            value={pixPayload}
            size={200}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={false}
          />
        </div>
        <p className="instrucao">
          Aponte a câmera do seu celular para o código acima
        </p>
      </div>

      <div className="copia-cola-section">
        <label>Pix Copia e Cola</label>
        <div className="input-group">
          <input type="text" readOnly value={pixPayload} />
          <button onClick={handleCopy} className={copiado ? "success" : ""}>
            {copiado ? <CheckCircle2 size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>
      <div className="senha-pix-confirm">
        <input
          type="password"
          placeholder="Senha de 4 dígitos"
          maxLength={4}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button onClick={confirmarPagamento} disabled={processando}>
          Confirmar e Pagar Agora
        </button>
      </div>
      {mesagem && <p className="error">{mesagem}</p>}
    </div>
  );
}
