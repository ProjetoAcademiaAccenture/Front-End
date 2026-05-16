import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useModuleAuth } from "../../../auth/hooks/useModuleAuth";
import { bancoAPI } from "../services/bancoAPI";
import PropTypes from "prop-types";

export const BancoContext = createContext();

export const BancoProvider = ({ children }) => {
  BancoProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const { user } = useModuleAuth("banco");
  const contaId = user?.contaId;

  const [saldo, setSaldo] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [extratoVisible, setExtratoVisible] = useState(true);

  const formatarTransacao = useCallback(
    (t) => ({
      id: t.id,
      tipo: t.tipo,
      descricao: t.descricao ?? "—",
      data: new Date(t.dataHora).toLocaleDateString("pt-BR"),
      valor: Number.parseFloat(t.valor),
    }),
    [],
  );

  const carregarDados = useCallback(async () => {
    if (!contaId) return;

    try {
      setLoading(true);
      setErro(null);

      const [conta, extrato] = await Promise.all([
        bancoAPI.getConta(contaId),
        bancoAPI.getExtrato(contaId),
      ]);

      setSaldo(Number.parseFloat(conta.saldo));
      setTransacoes(extrato.map(formatarTransacao));
    } catch (err) {
      setErro("Erro ao carregar dados da conta.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [contaId, formatarTransacao]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const adicionarTransacao = useCallback((descricao, tipo, valor) => {
    setTransacoes((prev) => [
      {
        id: Date.now(),
        descricao,
        data: new Date().toLocaleDateString("pt-BR"),
        tipo,
        valor,
      },
      ...prev,
    ]);

    if (tipo === "DEBITO") setSaldo((prev) => prev - valor);
    else if (tipo === "CREDITO") setSaldo((prev) => prev + valor);
  }, []);

  const fazerDeposito = useCallback(
    async (valor) => {
      if (valor <= 0) return false;

      try {
        const resultado = await bancoAPI.depositar(contaId, valor);
        setSaldo(Number.parseFloat(resultado.saldo));
        await carregarDados(); // opcional, para sincronizar tudo
        return true;
      } catch (err) {
        console.error("Erro ao depositar:", err);
        return false;
      }
    },
    [contaId, carregarDados],
  );

  const processarPagamento = useCallback(
    async (valor, descricao) => {
      if (saldo < valor) return false;

      try {
        adicionarTransacao(descricao, "DEBITO", valor);
        return true;
      } catch (err) {
        console.error("Erro ao processar pagamento:", err);
        return false;
      }
    },
    [saldo, adicionarTransacao],
  );

  const contextValue = useMemo(
    () => ({
      saldo,
      setSaldo,
      transacoes,
      setTransacoes,
      loading,
      erro,
      carregarDados,
      adicionarTransacao,
      fazerDeposito,
      processarPagamento,
      extratoVisible,
      setExtratoVisible,
    }),
    [
      saldo,
      transacoes,
      loading,
      erro,
      carregarDados,
      adicionarTransacao,
      fazerDeposito,
      processarPagamento,
      extratoVisible,
    ],
  );

  return (
    <BancoContext.Provider value={contextValue}>
      {children}
    </BancoContext.Provider>
  );
};
