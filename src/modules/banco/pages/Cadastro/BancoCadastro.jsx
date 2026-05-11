import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { bancoAPI } from "../../services/bancoAPI";
import { Input } from "../../../../components/custom/input/input";
import { useModuleAuth } from "../../../../auth/hooks/useModuleAuth";
import { onlyNumbers } from "../../../../utils/formatters";
import "./BancoCadastro.css";
import { ROUTES } from "../../../../constants";

const TIPOS_CONTA = [
  { label: "Conta Corrente", value: "CORRENTE" },
  { label: "Conta Poupança", value: "POUPANCA" },
  { label: "Conta Jurídica", value: "JURIDICA" },
];

export default function BancoCadastro() {
  const navigate = useNavigate();

  const { user: lojaUser, isAuthenticated: isLojaAuthenticated } =
    useModuleAuth("loja");

  const { signup: signupBanco } = useModuleAuth("banco");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senhaTransacao, setSenhaTransacao] = useState("");
  const [tipoConta, setTipoConta] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (lojaUser) {
      setNome(lojaUser.nome ?? "");
      setEmail(lojaUser.email ?? "");
    }
  }, [lojaUser]);

  const handleSenhaTransacaoChange = (value) => {
    const apenasNumeros = onlyNumbers(value).slice(0, 4);
    setSenhaTransacao(apenasNumeros);
  };

  const validateData = () => {
    if (!isLojaAuthenticated || !lojaUser?.clienteId) {
      setErro("Para criar uma conta é necessário estar logado na loja");
      return false;
    }

    if (!/^\d{4}$/.test(senhaTransacao)) {
      setErro("A senha de transação deve conter exatamente 4 números");
      return false;
    }

    if (!tipoConta) {
      setErro("Selecione o tipo da conta");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErro("");
    setSucesso("");

    if (!validateData()) return;

    setCarregando(true);

    const payload = {
      clienteId: lojaUser.clienteId,
      senhaTransacao,
      tipoConta,
    };

    try {
      console.log("payload de cadastro:", payload);
      const resultado = await bancoAPI.signup(payload);

      if (resultado.status === 200 || resultado.status === 201) {
        console.log("Resposta do cadastro:", resultado);
        const data = resultado.data;

        const bancoUser = {
          clienteId: lojaUser.clienteId,
          nome: lojaUser.nome,
          email: lojaUser.email,
          contaId: data.contaId ?? null,
          numeroConta: data.numeroConta ?? null,
          tipoConta: data.tipoConta ?? tipoConta,
        };

        signupBanco(bancoUser, data.token);

        setSucesso("Conta bancária criada com sucesso!");
        setTimeout(() => {
          navigate(ROUTES.BANK_DASHBOARD);
        }, 1200);
      } else {
        setErro(resultado.data?.error || "Não foi possível criar a conta.");
      }
    } catch (err) {
      setErro(err.message || "Erro ao fazer cadastro. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  if (!isLojaAuthenticated) {
    return (
      <div className="banco-auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1>🏦 Banco Digital</h1>
            <h2>Cadastro de Conta</h2>

            <div className="warning-message">
              Para criar uma conta é necessário estar logado na loja
            </div>

            <div className="auth-footer">
              <p>
                <Link to={ROUTES.LOGIN_SHOP}>Ir para login da loja</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="banco-auth-page">
      <div className="auth-container-register">
        <div className="auth-card">
          <h1>🏦 Banco Digital</h1>
          <h2>Cadastro de Conta</h2>

          {erro && <div className="error-message">{erro}</div>}
          {sucesso && <div className="success-message">{sucesso}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group-fullwidth">
              <label htmlFor="nome">Nome Completo</label>
              <Input
                id="nome"
                type="text"
                value={nome}
                readOnly
                disabled={true}
              />
            </div>

            <div className="form-group-fullwidth">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                disabled={true}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: "20px" }}>
              <div className="form-group-bank">
                <label htmlFor="senhaTransacao">Senha de transação</label>
                <Input
                  id="senhaTransacao"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={senhaTransacao}
                  onChange={(e) => handleSenhaTransacaoChange(e.target.value)}
                  placeholder="1234"
                  disabled={carregando}
                />
                <small className="input-help">
                  Exatamente 4 dígitos numéricos.
                </small>
              </div>

              <div className="form-group-bank">
                <label htmlFor="tipoConta">Tipo da conta</label>
                <select
                  id="tipoConta"
                  value={tipoConta}
                  onChange={(e) => setTipoConta(e.target.value)}
                  className="input-field"
                  disabled={carregando}
                >
                  <option value="">Selecione</option>
                  {TIPOS_CONTA.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-cadastro"
              disabled={carregando}
            >
              {carregando ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Já tem conta? <Link to={ROUTES.LOGIN_BANK}>Faça login aqui</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
