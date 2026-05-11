import React, { createContext, useState, useCallback } from 'react';

export const LojaContext = createContext();

export const LojaProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([
    { id: 1, nome: 'Notebook Pro', categoria: 'Eletrônicos', preco: 3500, estoque: 10, sku: 'SKU001' },
    { id: 2, nome: 'Mouse Gamer', categoria: 'Periféricos', preco: 250, estoque: 25, sku: 'SKU002' },
    { id: 3, nome: 'Teclado Mecânico', categoria: 'Periféricos', preco: 450, estoque: 15, sku: 'SKU003' },
    { id: 4, nome: 'Monitor 4K', categoria: 'Eletrônicos', preco: 1800, estoque: 5, sku: 'SKU004' },
  ]);

  const [carrinho, setCarrinho] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [faturamento, setFaturamento] = useState(0);
  const [boletos, setBoletos] = useState([]);
  const [boletoAtual, setBoletoAtual] = useState(null);

  const adicionarAoCarrinho = useCallback((produto, quantidade) => {
    const existe = carrinho.find((item) => item.id === produto.id);

    if (existe) {
      setCarrinho((prev) =>
        prev.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        )
      );
    } else {
      setCarrinho((prev) => [...prev, { ...produto, quantidade }]);
    }
  }, [carrinho]);

  const removerDoCarrinho = useCallback((produtoId) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== produtoId));
  }, []);

  const atualizarQuantidadeCarrinho = useCallback((produtoId, quantidade) => {
    if (quantidade <= 0) {
      removerDoCarrinho(produtoId);
    } else {
      setCarrinho((prev) =>
        prev.map((item) =>
          item.id === produtoId ? { ...item, quantidade } : item
        )
      );
    }
  }, [removerDoCarrinho]);

  const calcularTotal = useCallback(() => {
    return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  }, [carrinho]);

  const criarPedido = useCallback((pedido) => {
    const novoPedido = {
      id: pedidos.length + 1,
      ...pedido,
      data: new Date().toLocaleDateString('pt-BR'),
      status: 'PENDING',
    };

    setPedidos((prev) => [novoPedido, ...prev]);
    return novoPedido;
  }, [pedidos]);

  const finalizarPedido = useCallback((pedidoId) => {
    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, status: 'PAID' } : pedido
      )
    );

    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (pedido) {
      setFaturamento((prev) => prev + pedido.total);
    }

    setCarrinho([]);
  }, [pedidos]);

  const atualizarEstoque = useCallback((produtoId, novaQuantidade) => {
    setProdutos((prev) =>
      prev.map((produto) =>
        produto.id === produtoId
          ? { ...produto, estoque: novaQuantidade }
          : produto
      )
    );
  }, []);

  const adicionarProduto = useCallback((novoProduto) => {
    setProdutos((prev) => [
      ...prev,
      {
        ...novoProduto,
        id: prev.length + 1,
        sku: `SKU${String(prev.length + 1).padStart(3, '0')}`,
      },
    ]);
  }, []);

  const adicionarBoleto = useCallback((boleto) => {
    setBoletos((prev) => [...prev, boleto]);
    setBoletoAtual(boleto);
  }, []);

  const atualizarBoleto = useCallback((boletoId, dadosAtualizados) => {
    setBoletos((prev) =>
      prev.map((boleto) =>
        boleto.id === boletoId ? { ...boleto, ...dadosAtualizados } : boleto
      )
    );
    if (boletoAtual?.id === boletoId) {
      setBoletoAtual((prev) => ({ ...prev, ...dadosAtualizados }));
    }
  }, [boletoAtual]);

  return (
    <LojaContext.Provider
      value={{
        produtos,
        setProdutos,
        carrinho,
        setCarrinho,
        pedidos,
        setPedidos,
        faturamento,
        setFaturamento,
        boletos,
        setBoletos,
        boletoAtual,
        setBoletoAtual,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidadeCarrinho,
        calcularTotal,
        criarPedido,
        finalizarPedido,
        atualizarEstoque,
        adicionarProduto,
        adicionarBoleto,
        atualizarBoleto,
      }}
    >
      {children}
    </LojaContext.Provider>
  );
};
