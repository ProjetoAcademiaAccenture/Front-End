import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { lojaAPI } from "../../services/lojaAPI";
import { Input } from "../../../../components/custom/input/input";
import "./LojaCadastro.css";

import { getAddressByCep } from "../../services/viaCepAPI";
import { ROUTES } from "../../../../constants";

export default function LojaCadastro() {
  const [newUser, setNewUser] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dtNascimento, setDtNascimento] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const vatidateData = () => {
    if (!nome || nome.length < 3) {
      setErro("O nome deve conter pelo menos 3 caracteres");
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErro("Email inválido");
      return false;
    }
    if (!senha || senha.length < 6) {
      setErro("A senha deve conter pelo menos 6 caracteres");
      return false;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem");
      return false;
    }
    if (!cpf || !/^\d{11}$/.test(cpf)) {
      setErro("CPF inválido. Deve conter exatamente 11 números.");
      return false;
    }
    if (!telefone || !/^\d{10,11}$/.test(telefone)) {
      setErro(
        "Telefone inválido. Deve conter apenas números e ter 10 ou 11 dígitos.",
      );
      return false;
    }
    if (!dtNascimento) {
      setErro("Data de nascimento é obrigatória");
      return false;
    }
    if (dtNascimento > new Date().toISOString().split("T")[0]) {
      setErro("Data de nascimento não pode ser no futuro");
      return false;
    }
    if (!cep || !/^\d{8}$/.test(cep)) {
      setErro("CEP inválido. Deve conter exatamente 8 números.");
      return false;
    }
    if (!logradouro) {
      setErro("Logradouro é obrigatório");
      return false;
    }
    if (!numero) {
      setErro("Número é obrigatório");
      return false;
    }
    if (!bairro) {
      setErro("Bairro é obrigatório");
      return false;
    }
    if (!cidade) {
      setErro("Cidade é obrigatória");
      return false;
    }
    if (!estado) {
      setErro("Estado é obrigatório");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vatidateData()) return;
    setCarregando(true);
    setErro("");
    setSucesso("");

    try {
      const resultado = await lojaAPI.signup(newUser);
      if (resultado.success) {
        setSucesso("Cadastro realizado com sucesso!");
        signup(resultado.user, "loja");
        setTimeout(() => {
          navigate(ROUTES.LOGIN_SHOP);
        }, 1500);
      } else {
        setErro(resultado.error);
      }
    } catch (err) {
      setErro(err.message || "Erro ao fazer cadastro. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const handleFindCep = async (cepValue) => {
    setCep(cepValue);
    if (cepValue.length === 8) {
      try {
        const endereco = await getAddressByCep(cepValue);
        setLogradouro(endereco.logradouro);
        setBairro(endereco.bairro);
        setCidade(endereco.cidade);
        setEstado(endereco.estado);
      } catch (err) {
        setErro(
          err.message || "CEP não encontrado. Preencha os dados manualmente.",
        );
      }
    }
  };

  return (
    <div className="loja-auth-page">
      <div className="auth-container-register">
        <div className="auth-card">
          <h1>🛍️ Loja Online</h1>
          <h2>Cadastro</h2>

          {erro && <div className="error-message">{erro}</div>}
          {sucesso && <div className="success-message">{sucesso}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group-fullwidth">
              <label htmlFor="nome">Nome Completo</label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="João Silva"
                required
                disabled={carregando}
              />
            </div>

            <div className="form-group-fullwidth">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={carregando}
              />
            </div>

            <div className="form-group-register">
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <Input
                  id="senha"
                  isPassword
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={carregando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmarSenha">Confirmar Senha</label>
                <Input
                  id="confirmarSenha"
                  isPassword
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={carregando}
                />
              </div>
            </div>

            <div className="form-group-register">
              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <Input
                  id="cpf"
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="apenas números"
                  required
                  disabled={carregando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <Input
                  id="telefone"
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                  disabled={carregando}
                />
              </div>
            </div>

            <div className="form-group-register">
              <div className="form-group">
                <label htmlFor="dtNascimento">Data de Nascimento</label>
                <Input
                  id="dtNascimento"
                  type="date"
                  value={dtNascimento}
                  onChange={(e) => setDtNascimento(e.target.value)}
                  required
                  disabled={carregando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <Input
                  id="cep"
                  type="text"
                  value={cep}
                  onChange={(e) => handleFindCep(e.target.value)}
                  onBlur={(e) => handleFindCep(e.target.value)}
                  placeholder="apenas números"
                  required
                  disabled={carregando}
                />
              </div>
            </div>

            <div className="form-group-fullwidth">
              <label htmlFor="logradouro">Logradouro</label>
              <Input
                id="logradouro"
                type="text"
                value={logradouro}
                onChange={(e) => setLogradouro(e.target.value)}
                required
                disabled={true}
              />
            </div>

            <div className="form-group-register">
              <div className="form-group">
                <label htmlFor="numero">Número</label>
                <Input
                  id="numero"
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  required
                  disabled={carregando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="complemento">Complemento</label>
                <Input
                  id="complemento"
                  type="text"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  disabled={carregando}
                />
              </div>
            </div>

            <div className="form-group-fullwidth">
              <label htmlFor="bairro">Bairro</label>
              <Input
                id="bairro"
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                required
                disabled={true}
              />
            </div>

            <div className="form-group-register">
              <div className="form-group">
                <label htmlFor="cidade">Cidade</label>
                <Input
                  id="cidade"
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  required
                  disabled={true}
                />
              </div>

              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <Input
                  id="estado"
                  type="text"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                  disabled={true}
                />
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
              Já tem conta? <a href="/loja/login">Faça login aqui</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
