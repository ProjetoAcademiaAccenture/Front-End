import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useModuleAuth } from "../auth/hooks/useModuleAuth";
import PropTypes from "prop-types";

export const LojaContext = createContext();

export const LojaProvider = ({ children }) => {
  const { user } = useModuleAuth("loja");

  const userId = user?.clienteId;

  const getCarrinhoKey = useCallback(() => {
    return userId ? `loja_carrinho_user_${userId}` : null;
  }, [userId]);

  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [faturamento, setFaturamento] = useState(0);
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    const key = getCarrinhoKey();
    if (key) {
      const salvo = localStorage.getItem(key);
      setCarrinho(salvo ? JSON.parse(salvo) : []);
    } else {
      setCarrinho([]);
    }
  }, [userId, getCarrinhoKey]);

  useEffect(() => {
    const key = getCarrinhoKey();
    if (key && carrinho.length >= 0) {
      localStorage.setItem(key, JSON.stringify(carrinho));
    }
  }, [carrinho, getCarrinhoKey]);

  useEffect(() => {
    if (!userId) {
      setCarrinho([]);
    }
  }, [userId]);

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

  const esvazearCarrinho = useCallback(() => {
    setCarrinho([]);
  }, []);

  const calcularTotal = useCallback(() => {
    return carrinho.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0,
    );
  }, [carrinho]);


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
      esvazearCarrinho,
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
      esvazearCarrinho,
    ],
  );
  return (
    <LojaContext.Provider value={contextValue}>{children}</LojaContext.Provider>
  );
};

LojaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
