import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { bancoAPI } from "../../services/bancoAPI";
import { Input } from "../../../../components/custom/input/input";
import "./BancoLogin.css";
import { useModuleAuth } from "../../../../auth/hooks/useModuleAuth";
import { onlyNumbers } from "../../../../utils/formatters";

export default function BancoLogin() {
  const { user: lojaUser } =
    useModuleAuth("loja");
  const { login } = useModuleAuth("banco");
  const [numeroConta, setNumeroConta] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSenhaTransacaoChange = (value) => {
      const apenasNumeros = onlyNumbers(value).slice(0, 4);
      setSenha(apenasNumeros);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      const resultado = await bancoAPI.login({
        numero_conta: numeroConta,
        senha,
      });

      if (resultado?.token) {
        const userData = {
          clienteId: resultado.clienteId,
          contaId: resultado.contaId,
          numeroConta: resultado.numeroConta,
          saldo: resultado.saldo,
          limiteCeditoDisponivel: resultado.limiteCeditoDisponivel,
          tipoConta: resultado.tipoConta,
          nome: lojaUser.nome,
          email: lojaUser.email,
        };

        login(userData, resultado.token);
        navigate("/banco/dashboard");
      } else {
        setErro("Dados inválidos.");
      }
    } catch (err) {
      setErro(err.message || "Erro ao fazer login. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="banco-auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>🏦 Banco Digital</h1>
          <h2>Login</h2>

          {erro && <div className="error-message">{erro}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group-fullwidth">
              <label htmlFor="numeroConta">Número da conta</label>
              <Input
                id="numeroConta"
                type="text"
                value={numeroConta}
                onChange={(e) => setNumeroConta(e.target.value)}
                placeholder="123456-7"
                required
                disabled={carregando}
              />
            </div>

            <div className="form-group-fullwidth">
              <label htmlFor="senha">Senha de transação</label>
              <Input
                id="senha"
                isPassword
                value={senha}
                onChange={(e) => handleSenhaTransacaoChange(e.target.value)}
                placeholder="••••"
                required
                disabled={carregando}
              />
            </div>

            <button type="submit" className="btn-login" disabled={carregando}>
              {carregando ? "Conectando..." : "Entrar"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Não tem conta? <Link to="/banco/signup">Crie uma aqui</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
