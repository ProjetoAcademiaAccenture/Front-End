import { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useModuleAuth } from '../../../auth/hooks/useModuleAuth';
import { bancoAPI } from '../services/bancoAPI'; 
import PropTypes from 'prop-types';

export const BancoContext = createContext();

export const BancoProvider = ({ children }) => {
  BancoProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const { user } = useModuleAuth('banco');
  const contaId = user?.contaId; // ajuste o campo se for diferente

  const [saldo, setSaldo] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [extratoVisible, setExtratoVisible] = useState(true);

  // Formata transação do backend pro formato do componente Extrato
  const formatarTransacao = (t) => ({
    id: t.id,
    tipo: t.tipo,                    // já vem em maiúsculo do enum Java
    descricao: t.descricao ?? '—',
    data: new Date(t.dataHora).toLocaleDateString('pt-BR'),
    valor: Number.parseFloat(t.valor),      // BigDecimal vem como string no JSON
  });

  // Busca conta + extrato ao montar
  useEffect(() => {
    if (!contaId) return;

    const carregarDados = async () => {
      try {
        setLoading(true);
        const [conta, extrato] = await Promise.all([
          bancoAPI.getConta(contaId),
          bancoAPI.getExtrato(contaId),
        ]);

        setSaldo(Number.parseFloat(conta.saldo));         // BigDecimal → number
        setTransacoes(extrato.map(formatarTransacao));
      } catch (err) {
        setErro('Erro ao carregar dados da conta.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [contaId]);

  const adicionarTransacao = useCallback((descricao, tipo, valor) => {
    setTransacoes((prev) => [
      {
        id: Date.now(),
        descricao,
        data: new Date().toLocaleDateString('pt-BR'),
        tipo,
        valor,
      },
      ...prev,
    ]);

    if (tipo === 'DEBITO') setSaldo((prev) => prev - valor);
    else if (tipo === 'CREDITO') setSaldo((prev) => prev + valor);
  }, []);

  const fazerDeposito = useCallback(async (valor) => {
    if (valor <= 0) return false;
    try {
      const resultado = await bancoAPI.depositar(contaId, valor);
      // Atualiza saldo com o valor real retornado pelo backend
      setSaldo(Number.parseFloat(resultado.saldo));
      // Rebusca extrato pra garantir sincronia
      const extrato = await bancoAPI.getExtrato(contaId);
      setTransacoes(extrato.map(formatarTransacao));
      return true;
    } catch (err) {
      console.error('Erro ao depositar:', err);
      return false;
    }
  }, [contaId]);

  const processarPagamento = useCallback(async (valor, descricao) => {
    if (saldo < valor) return false;
    try {
      // chame o endpoint de pagamento aqui quando tiver
      adicionarTransacao(descricao, 'DEBITO', valor);
      return true;
    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      return false;
    }
  }, [saldo, adicionarTransacao]);

  const contextValue = useMemo(() => ({
    saldo, setSaldo,
    transacoes, setTransacoes,
    loading, erro,
    adicionarTransacao,
    fazerDeposito,
    processarPagamento,
    extratoVisible, setExtratoVisible,
  }), [saldo, transacoes, loading, erro, adicionarTransacao, fazerDeposito, processarPagamento, extratoVisible]);

  return (
    <BancoContext.Provider value={contextValue}>
      {children}
    </BancoContext.Provider>
  );
};