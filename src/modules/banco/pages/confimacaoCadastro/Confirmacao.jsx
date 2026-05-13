import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Confirmacao.css";
import { ROUTES } from "../../../../constants";
export default function Confirmacao() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
        navigate(ROUTES.LOGIN_SHOP);
       // ajuste se sua rota for diferente
    }, 300);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="confirmacao-container">
      <div className="confirmacao-card">
        <h1 className="confirmacao-title">
          Conta criada com sucesso! 🎉
        </h1>

        <p className="confirmacao-text">
          Você será redirecionado para o login em instantes...
        </p>
      </div>
    </div>
  );
}