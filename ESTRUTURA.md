# 📋 Documentação da Estrutura do Projeto

## 🎯 Visão Geral

Projeto **E-Commerce System** - um sistema modular em React com dois módulos principais:
- **🏦 Banco Digital** - Gerenciamento financeiro
- **🛍️ Loja Online** - E-commerce completo

## 📂 Árvore de Diretórios Completa

```
Front-end/
├── public/
│   └── index.html                          # HTML principal
├── src/
│   ├── index.js                            # Ponto de entrada
│   ├── App.jsx                             # Componente raiz
│   ├── App.css                             # Estilos globais do app
│   │
│   ├── context/                            # Gerenciamento de estado global
│   │   ├── AuthContext.jsx                 # Contexto de autenticação
│   │   ├── BancoContext.jsx                # Estado do banco digital
│   │   └── LojaContext.jsx                 # Estado da loja online
│   │
│   ├── styles/
│   │   └── index.css                       # Estilos globais CSS
│   │
│   ├── pages/                              # Páginas raiz da aplicação
│   │   ├── Home.jsx                        # Página inicial
│   │   └── Home.css
│   │
│   ├── shared/                             # Componentes compartilhados
│   │   ├── components/                     # Componentes reutilizáveis
│   │   └── styles/                         # Estilos compartilhados
│   │
│   └── modules/                            # Módulos principais
│       │
│       ├── banco/                          # 🏦 MÓDULO BANCO
│       │   ├── BancoLayout.jsx             # Layout e roteamento
│       │   ├── BancoLayout.css
│       │   │
│       │   ├── hooks/
│       │   │   └── useBanco.js             # Hook customizado
│       │   │
│       │   ├── services/
│       │   │   └── bancoAPI.js             # Chamadas à API (simulada)
│       │   │
│       │   ├── components/                 # Componentes reutilizáveis
│       │   │   ├── BancoHeader/
│       │   │   │   ├── BancoHeader.jsx
│       │   │   │   └── BancoHeader.css
│       │   │   ├── BancoMenu/
│       │   │   │   ├── BancoMenu.jsx
│       │   │   │   └── BancoMenu.css
│       │   │   └── Extrato/
│       │   │       ├── Extrato.jsx
│       │   │       └── Extrato.css
│       │   │
│       │   └── pages/                      # Páginas do banco
│       │       ├── Login/
│       │       │   ├── BancoLogin.jsx
│       │       │   └── BancoLogin.css
│       │       ├── Cadastro/
│       │       │   ├── BancoCadastro.jsx
│       │       │   └── BancoCadastro.css
│       │       ├── Dashboard/
│       │       │   ├── BancoDashboard.jsx
│       │       │   └── BancoDashboard.css
│       │       ├── Transacoes/
│       │       │   ├── BancoTransacoes.jsx
│       │       │   └── BancoTransacoes.css
│       │       ├── Deposito/
│       │       │   ├── BancoDeposito.jsx
│       │       │   └── BancoDeposito.css
│       │       └── Perfil/
│       │           ├── BancoPerfil.jsx
│       │           └── BancoPerfil.css
│       │
│       └── loja/                           # 🛍️ MÓDULO LOJA
│           ├── LojaLayout.jsx              # Layout e roteamento
│           ├── LojaLayout.css
│           │
│           ├── hooks/
│           │   └── useLojaContext.js       # Hook customizado
│           │
│           ├── services/
│           │   └── lojaAPI.js              # Chamadas à API (simulada)
│           │
│           ├── components/                 # Componentes reutilizáveis
│           │   ├── LojaHeader/
│           │   │   ├── LojaHeader.jsx
│           │   │   └── LojaHeader.css
│           │   ├── LojaMenu/
│           │   │   ├── LojaMenu.jsx
│           │   │   └── LojaMenu.css
│           │   ├── ProductCard/
│           │   │   ├── ProductCard.jsx
│           │   │   └── ProductCard.css
│           │   └── CarrinhoItem/
│           │       ├── CarrinhoItem.jsx
│           │       └── CarrinhoItem.css
│           │
│           └── pages/                      # Páginas da loja
│               ├── Login/
│               │   ├── LojaLogin.jsx
│               │   └── LojaLogin.css
│               ├── Cadastro/
│               │   ├── LojaCadastro.jsx
│               │   └── LojaCadastro.css
│               ├── Produtos/
│               │   ├── LojaProdutos.jsx
│               │   └── LojaProdutos.css
│               ├── Carrinho/
│               │   ├── LojaCarrinho.jsx
│               │   └── LojaCarrinho.css
│               ├── Pagamento/
│               │   ├── LojaPagamento.jsx
│               │   └── LojaPagamento.css
│               ├── Pedidos/
│               │   ├── LojaPedidos.jsx
│               │   └── LojaPedidos.css
│               ├── Estoque/
│               │   ├── LojaEstoque.jsx
│               │   └── LojaEstoque.css
│               ├── Admin/
│               │   ├── LojaAdmin.jsx
│               │   └── LojaAdmin.css
│               └── Perfil/
│                   ├── LojaPerfil.jsx
│                   └── LojaPerfil.css
│
├── package.json                            # Configuração do projeto
├── .gitignore                              # Arquivos ignorados pelo git
├── README.md                               # Documentação geral
├── SETUP.md                                # Guia de instalação
└── ESTRUTURA.md                            # Este arquivo
```

## 🔄 Fluxo de Dados

### Autenticação
```
AuthContext (Login/Logout)
├── user: Dados do usuário
├── isLoggedIn: Status de login
└── userType: 'banco' | 'loja'
```

### Banco Digital
```
BancoContext
├── saldo: Valor disponível
├── transacoes: Array de transações
├── processorPagamento(): Debita saldo
└── adicionarTransacao(): Registra movimento
```

### Loja Online
```
LojaContext
├── produtos: Catálogo disponível
├── carrinho: Itens selecionados
├── pedidos: Histórico de compras
└── faturamento: Total arrecadado
```

## 📱 Rotas Disponíveis

### Banco
```
/banco/login              → Login
/banco/signup             → Cadastro
/banco/dashboard          → Dashboard (protegido)
/banco/transacoes         → Histórico (protegido)
/banco/deposito           → Fazer depósito (protegido)
/banco/perfil             → Perfil do usuário (protegido)
```

### Loja
```
/loja/login               → Login
/loja/signup              → Cadastro
/loja/produtos            → Catálogo (protegido)
/loja/carrinho            → Carrinho (protegido)
/loja/pagamento           → Checkout (protegido)
/loja/pedidos             → Meus pedidos (protegido)
/loja/perfil              → Perfil (protegido)
/loja/admin               → Dashboard admin (admin only)
/loja/estoque             → Gerenciar estoque (admin only)
```

## 🎨 Paleta de Cores

- **Banco**: `#003087` (Azul)
- **Loja**: `#1a5c38` (Verde)
- **Fundo**: `#f0f2f5` (Cinza claro)
- **Texto**: `#222` (Cinza escuro)
- **Sucesso**: `#28c840` (Verde)
- **Erro**: `#ff5f57` (Vermelho)

## 💾 Estado da Aplicação

### LocalStorage (Futuro)
- Autenticação (user, token)
- Carrito temporário
- Preferências de usuário

### Context API (Atual)
- Estado de autenticação
- Estado do banco
- Estado da loja
- Carrinho de compras

## 🔐 Segurança

- Proteção de rotas autenticadas
- Validação de campos
- Controle de acesso para admin
- Simulação segura de pagamentos

## 📦 Dependências

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "axios": "^1.3.0"
}
```

## 🚀 Scripts Disponíveis

```bash
npm start       # Inicia desenvolvimento
npm run build   # Build para produção
npm test        # Executa testes
npm run eject   # Expõe configurações (irreversível)
```

## 📊 Componentes por Módulo

### Banco (12 componentes)
- 1 Layout
- 3 Componentes compartilhados
- 6 Páginas

### Loja (14 componentes)
- 1 Layout
- 4 Componentes compartilhados
- 8 Páginas

### Compartilhados
- Home page
- Estilos globais

**Total: 27+ componentes**

---

Criado com ❤️ em React
