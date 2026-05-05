import React, { useState } from 'react';
import { useBanco } from '../../hooks/useBanco';
import { Input } from '../../../../components/custom/input/input';
import './BancoDeposito.css';

export default function BancoDeposito() {
  const [valor, setValor] = useState('');
  const [metodo, setMetodo] = useState('debito');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const { fazerDeposito } = useBanco();

  const handleSubmit = (e) => {
    e.preventDefault();
    setCarregando(true);

    const valorNum = parseFloat(valor);
    if (valorNum > 0) {
      setTimeout(() => {
        fazerDeposito(valorNum);
        setSucesso(true);
        setValor('');
        setCarregando(false);

        setTimeout(() => {
          setSucesso(false);
        }, 3000);
      }, 500);
    }
  };

  return (
    <div className="banco-page">
      <div className="page-header">
        <h1>💰 Depósito</h1>
        <p className="page-subtitle">Adicione fundos à sua conta</p>
      </div>

      {sucesso && (
        <div className="success-alert">
          ✓ Depósito realizado com sucesso!
        </div>
      )}

      <div className="deposito-container">
        <div className="deposito-card">
          <h2>Novo Depósito</h2>

          <form onSubmit={handleSubmit} className="deposito-form">
            <div className="form-group">
              <label htmlFor="valor">Valor do Depósito (R$)</label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="1.000,00"
                required
                disabled={carregando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="metodo">Método de Pagamento</label>
              <select
                id="metodo"
                value={metodo}
                onChange={(e) => setMetodo(e.target.value)}
                disabled={carregando}
              >
                <option value="debito">💳 Débito</option>
                <option value="credito">💳 Crédito</option>
                <option value="transferencia">🏦 Transferência Bancária</option>
                <option value="pix">📱 PIX</option>
              </select>
            </div>

            <div className="form-group">
              <button type="submit" className="btn-depositar" disabled={carregando}>
                {carregando ? 'Processando...' : 'Depositar'}
              </button>
            </div>
          </form>
        </div>

        <div className="deposito-info">
          <h3>📌 Informações Importantes</h3>
          <ul>
            <li>✓ Depósitos são processados em tempo real</li>
            <li>✓ Não há taxa para depósitos</li>
            <li>✓ Você pode depositar até R$ 50.000 por dia</li>
            <li>✓ Todos os métodos de pagamento são seguros</li>
          </ul>

          <h3 style={{ marginTop: '30px' }}>🏦 Dados para Transferência</h3>
          <div className="dados-banco">
            <div className="dado">
              <span className="label">Banco:</span>
              <span className="valor">Digital Bank</span>
            </div>
            <div className="dado">
              <span className="label">Agência:</span>
              <span className="valor">0001</span>
            </div>
            <div className="dado">
              <span className="label">Conta:</span>
              <span className="valor">1234567-8</span>
            </div>
            <div className="dado">
              <span className="label">CPF/CNPJ:</span>
              <span className="valor">12.345.678/0001-90</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
