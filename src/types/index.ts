// Authentication
export interface Endereco {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  numero: string;
  complemento?: string;
  tipoEndereco: 'RESIDENCIAL' | 'COMERCIAL';
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  tipoCliente: 'ROLE_USER' | 'ROLE_ADMIN';
  enderecos: Endereco[];
}

export interface AuthRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  senha: string;
  endereco: Endereco;
}

export interface AuthResponse {
  token: string;
  clienteId: number;
  nome: string;
  email: string;
  tipoCliente: string;
}

export interface BankRegisterRequest {
  clienteId: number;
  senhaTransacao: string;
}

export interface Conta {
  id: number;
  numeroConta: string;
  saldo: number;
  limiteCredito: number;
  tipoConta: 'CORRENTE' | 'POUPANCA';
  ativo: boolean;
  clienteId: number;
  clienteNome: string;
}

// Transactions
export interface Transacao {
  id: number;
  dataHora: string;
  tipo: 'DEPOSITO' | 'TRANSFERENCIA' | 'PAGAMENTO' | 'ESTORNO';
  valor: number;
  descricao: string;
  saldoAposFinal: number;
}

// Products & Orders
export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  metodoPgto: 'PIX' | 'CREDITO' | 'DEBITO' | 'BOLETO';
}

export interface CartItem {
  produtoId: number;
  quantidade: number;
  produto?: Produto;
}

export interface Pedido {
  id: number;
  clienteId: number;
  itens: CartItem[];
  endereco: Endereco;
  status: 'CARRINHO' | 'RESERVADO' | 'PAGO' | 'CANCELADO';
  dataCreated?: string;
  dataAtualizado?: string;
}

export interface Boleto {
  id: number;
  codigoBarras: string;
  valor: number;
  dataVencimento: string;
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  pedidoId: number;
}

// API Error
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

// Filter params
export interface StatementFilter {
  inicio?: string;
  fim?: string;
  tipo?: 'DEPOSITO' | 'TRANSFERENCIA' | 'PAGAMENTO' | 'ESTORNO';
}
