import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { lojaAPI } from "../../services/lojaAPI";
import { Input } from "../../../../components/custom/input/input";
import "./LojaCadastro.css";

import { getAddressByCep } from "../../services/viaCepAPI";
import { ROUTES } from "../../../../constants";
import {
  dateBrToIso,
  maskCep,
  maskCpf,
  maskDate,
  maskPhone,
  onlyNumbers,
} from "../../../../utils/formatters";

export default function LojaCadastro() {
  const { signup } = useContext(AuthContext);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setdataNascimento] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [tipoEndereco, setTipoEndereco] = useState("RESIDENCIAL");
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [exibirMensagem, setExibirMensagem] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const vatidateData = () => {
    if (!nome || nome.length < 3) {
      setErro("O nome deve conter pelo menos 3 caracteres");
      handleExibirMensagem(5000);
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErro("Email inválido");
      handleExibirMensagem(5000);
      return false;
    }
    if (!senha || senha.length < 6) {
      setErro("A senha deve conter pelo menos 6 caracteres");
      handleExibirMensagem(5000);
      return false;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem");
      handleExibirMensagem(5000);
      return false;
    }
    if (!cpf || !/^\d{11}$/.test(onlyNumbers(cpf))) {
      setErro("CPF inválido. Deve conter exatamente 11 números.");
      handleExibirMensagem(5000);
      return false;
    }
    if (!telefone || !/^\d{10,11}$/.test(onlyNumbers(telefone))) {
      setErro(
        "Telefone inválido. Deve conter apenas números e ter 10 ou 11 dígitos.",
      );
      handleExibirMensagem(5000);
      return false;
    }
    if (!dataNascimento) {
      setErro("Data de nascimento é obrigatória");
      handleExibirMensagem(5000);
      return false;
    }
    if (!cep || !/^\d{8}$/.test(onlyNumbers(cep))) {
      setErro("CEP inválido. Deve conter exatamente 8 números.");
      handleExibirMensagem(5000);
      return false;
    }
    if (!logradouro) {
      setErro("Logradouro é obrigatório");
      handleExibirMensagem(5000);
      return false;
    }
    if (!numero) {
      setErro("Número é obrigatório");
      handleExibirMensagem(5000);
      return false;
    }
    if (!bairro) {
      setErro("Bairro é obrigatório");
      handleExibirMensagem(5000);
      return false;
    }
    if (!cidade) {
      setErro("Cidade é obrigatória");
      handleExibirMensagem(5000);
      return false;
    }
    if (!estado) {
      setErro("Estado é obrigatório");
      handleExibirMensagem(5000);
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

    const payload = {
      nome,
      email,
      senha,
      cpf: onlyNumbers(cpf),
      telefone: onlyNumbers(telefone),
      dataNascimento: dateBrToIso(dataNascimento),
      endereco: {
        cep: onlyNumbers(cep),
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        uf: estado,
        tipoEndereco,
      },
    };

    try {
      console.log("payload de cadastro:", payload);

      const resultado = await lojaAPI.signup(payload);

      if (resultado.status === 200 || resultado.status === 201) {
        console.log("Resposta do cadastro:", resultado);
        const userData = resultado.data;
        
        signup("loja", userData, userData.token);
        setSucesso("Cadastro realizado com sucesso!");
        navigate(ROUTES.PRODUCTS);
      } else {
        setErro(resultado.error);
        handleExibirMensagem(5000);
      }
    } catch (err) {
      setErro(err.message || "Erro ao fazer cadastro. Tente novamente.");
      handleExibirMensagem(5000);
    } finally {
      setCarregando(false);
    }
  };

  const handleFindCep = async (cepValue) => {
    const cepLimpo = onlyNumbers(cepValue);
    setCep(maskCep(cepValue));

    if (cepLimpo.length === 8) {
      try {
        const endereco = await getAddressByCep(cepLimpo);
        setLogradouro(endereco.logradouro);
        setBairro(endereco.bairro);
        setCidade(endereco.cidade);
        setEstado(endereco.estado);
      } catch (err) {
        setErro(
          err.message || "CEP não encontrado. Preencha os dados manualmente.",
        );
        handleExibirMensagem(5000);
      }
    }
  };

  const handleExibirMensagem = (tempo) => {
    setExibirMensagem(true);
    setTimeout(() => {
      setExibirMensagem(false);
    }, tempo);
  };

  return (
    <div className="loja-auth-page">
      <div className="auth-container-register">
        <div className="auth-card">
          <h1>🛍️ Loja Online</h1>
          <h2>Cadastro</h2>

          {erro && exibirMensagem && (
            <div className="error-message">{erro}</div>
          )}
          {sucesso && <div className="success-message">{sucesso}</div>}

          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          >
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
                  onChange={(e) => setCpf(maskCpf(e.target.value))}
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
                  onChange={(e) => setTelefone(maskPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  required
                  disabled={carregando}
                />
              </div>
            </div>

            <div className="form-group-register">
              <div className="form-group">
                <label htmlFor="dataNascimento">Data de Nascimento</label>
                <Input
                  id="dataNascimento"
                  type="text"
                  value={dataNascimento}
                  onChange={(e) => setdataNascimento(maskDate(e.target.value))}
                  placeholder="DD/MM/AAAA"
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
                  placeholder="00000-000"
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

              <div className="form-group">
                <label htmlFor="tipoEndereco">Tipo de Endereço</label>
                <select
                  id="tipoEndereco"
                  value={tipoEndereco}
                  onChange={(e) => setTipoEndereco(e.target.value)}
                  disabled={carregando}
                  className="input-field"
                >
                  <option value="RESIDENCIAL">Residencial</option>
                  <option value="COMERCIAL">Comercial</option>
                  <option value="ENTREGA">Entrega</option>
                  <option value="OUTROS">Outros</option>
                </select>
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
