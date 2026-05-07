import { createContext, useState, useCallback } from 'react';

export const BancoContext = createContext();

export const BancoProvider = ({ children }) => {
  const [saldo, setSaldo] = useState(15000);
  const [transacoes, setTransacoes] = useState([
    {
      id: 1,
      descricao: 'Depósito inicial',
      data: '01/05/2026',
      tipo: 'credito',
      valor: 15000,
    },
  ]);
  const [extratoVisible, setExtratoVisible] = useState(true);

  const adicionarTransacao = useCallback((descricao, tipo, valor) => {
    const novaTransacao = {
      id: transacoes.length + 1,
      descricao,
      data: new Date().toLocaleDateString('pt-BR'),
      tipo,
      valor,
    };

    setTransacoes([novaTransacao, ...transacoes]);

    if (tipo === 'debito') {
      setSaldo((prev) => prev - valor);
    } else if (tipo === 'credito') {
      setSaldo((prev) => prev + valor);
    }

    return novaTransacao;
  }, [transacoes]);

  const fazerDeposito = useCallback((valor) => {
    if (valor > 0) {
      setSaldo((prev) => prev + valor);
      adicionarTransacao(`Depósito de R$ ${valor.toFixed(2)}`, 'credito', valor);
      return true;
    }
    return false;
  }, [adicionarTransacao]);

  const processarPagamento = useCallback((valor, descricao) => {
    if (saldo >= valor) {
      setSaldo((prev) => prev - valor);
      adicionarTransacao(descricao, 'debito', valor);
      return true;
    }
    return false;
  }, [saldo, adicionarTransacao]);

  return (
    <BancoContext.Provider
      value={{
        saldo,
        setSaldo,
        transacoes,
        setTransacoes,
        adicionarTransacao,
        fazerDeposito,
        processarPagamento,
        extratoVisible,
        setExtratoVisible,
      }}
    >
      {children}
    </BancoContext.Provider>
  );
};

const acountProps = {
  id: null,
  numero: null,
  tipo: null, // 'corrente', 'poupanca' ou 'PJ'
  saldo: null,
  idCLiente: null,
};
