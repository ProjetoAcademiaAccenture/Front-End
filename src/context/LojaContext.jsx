import { createContext, useState, useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

export const LojaContext = createContext();

const CARRINHO_KEY = "loja_carrinho";

export const LojaProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [faturamento, setFaturamento] = useState(0);

  const [carrinho, setCarrinho] = useState(() => {
    const salvo = localStorage.getItem(CARRINHO_KEY);
    return salvo ? JSON.parse(salvo) : [];
  });

  useEffect(() => {
    localStorage.setItem(CARRINHO_KEY, JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarAoCarrinho = useCallback((produto, quantidade) => {
    setCarrinho((prev) => {
      const existe = prev.find((item) => item.id === produto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item,
        );
      }
      return [...prev, { ...produto, quantidade }];
    });
  }, []);

  const removerDoCarrinho = useCallback((produtoId) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== produtoId));
  }, []);

  const atualizarQuantidadeCarrinho = useCallback((produtoId, quantidade) => {
    setCarrinho((prev) => {
      if (quantidade <= 0) return prev.filter((item) => item.id !== produtoId);
      return prev.map((item) =>
        item.id === produtoId ? { ...item, quantidade } : item,
      );
    });
  }, []);

  const calcularTotal = useCallback(() => {
    return carrinho.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0,
    );
  }, [carrinho]);

  const finalizarPedido = useCallback(() => {
    const total = calcularTotal();
    setFaturamento((prev) => prev + total);
    setPedidos((prev) => [
      ...prev,
      { id: Date.now(), itens: carrinho, total },
    ]);
    setCarrinho([]);
  }, [carrinho, calcularTotal]);

  const contextValue = useMemo(
    () => ({
      produtos,
      setProdutos,
      carrinho,
      setCarrinho,
      pedidos,
      setPedidos,
      faturamento,
      setFaturamento,
      adicionarAoCarrinho,
      removerDoCarrinho,
      atualizarQuantidadeCarrinho,
      calcularTotal,
      finalizarPedido,
    }),
    [
      produtos,
      carrinho,
      pedidos,
      faturamento,
      adicionarAoCarrinho,
      removerDoCarrinho,
      atualizarQuantidadeCarrinho,
      calcularTotal,
      finalizarPedido,
    ],
  );

  return (
    <LojaContext.Provider value={contextValue}>
      {children}
    </LojaContext.Provider>
  );
};

LojaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
