import "./BancoHeader.css";

export default function BancoHeader({ usuarioNome, saldo, limite }) {
  return (
    <header className="banco-header">
      <div>
        <h1 className="banco-title">🏦 Banco Digital</h1>
        {usuarioNome && <p className="banco-user">Bem-vindo, {usuarioNome}</p>}
      </div>
      <div style={{ display: "flex", flexFlow: "row wrap", gap: "20px" }}>
        <div className="banco-saldo-block">
          <span className="banco-saldo-label">Saldo disponível</span>
          <div className="banco-saldo">
            R${" "}
            {(saldo ?? 0).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="banco-saldo-block">
          <span className="banco-saldo-label">
            Limite de crédito disponível
          </span>
          <div className="banco-saldo">
            R${" "}
            {(limite ?? 0).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
