import { useEffect, useState } from "react";
import axios from "axios";

export default function Loja() {

  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/produtos")
      .then(res => {
        console.log(res.data);
        setProdutos(res.data);
      })
      .catch(err => {
        console.error("Erro ao buscar produtos:", err);
      });
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>🛍️ Loja</h1>

      {produtos.length === 0 && <p>Carregando...</p>}

      {produtos.map(p => (
        <div key={p.id} style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginTop: "10px"
        }}>
          <h3>{p.nome}</h3>
          <p>💰 {p.preco}</p>
          <p>📦 Estoque: {p.quantidadeEstoque}</p>
        </div>
      ))}
    </div>
  );
}