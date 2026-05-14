# E-Commerce System - React Modular

Um sistema completo de e-commerce modular construído com **React**, dividido em dois módulos principais: **Banco Digital** e **Loja Online**.

## 🎯 Características

### 📦 Estrutura Modular
- Separação clara entre módulos (Banco e Loja)
- Componentes reutilizáveis
- Contextos globais para gerenciamento de estado
- Serviços de API simulados

### 🏦 Módulo Banco
- ✅ **Login e Cadastro** - Autenticação de usuários
- ✅ **Dashboard** - Visualização de saldo e estatísticas
- ✅ **Transações** - Histórico completo de movimentações
- ✅ **Depósito** - Adicionar fundos à conta
- ✅ **Perfil** - Gerenciar dados pessoais e segurança
- ✅ **Extrato** - Listagem de todas as transações

### 🛍️ Módulo Loja
- ✅ **Login e Cadastro** - Autenticação com tipo de conta (cliente/admin)
- ✅ **Catálogo de Produtos** - Visualização com filtros por categoria
- ✅ **Carrinho de Compras** - Adicionar/remover produtos
- ✅ **Checkout** - Processo de pagamento seguro
- ✅ **Meus Pedidos** - Histórico e status de compras
- ✅ **Painel Admin** - Dashboard administrativo (acesso restrito)
- ✅ **Gerenciador de Estoque** - Controle de inventário
- ✅ **Perfil** - Gerenciar dados pessoais

## 📁 Estrutura de Pastas

```
projeto/Front-end/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── BancoContext.jsx
│   │   └── LojaContext.jsx
│   ├── modules/
│   │   ├── banco/
│   │   │   ├── pages/
│   │   │   │   ├── Login/
│   │   │   │   ├── Cadastro/
│   │   │   │   ├── Dashboard/
│   │   │   │   ├── Transacoes/
│   │   │   │   ├── Deposito/
│   │   │   │   └── Perfil/
│   │   │   ├── components/
│   │   │   │   ├── BancoHeader/
│   │   │   │   ├── BancoMenu/
│   │   │   │   └── Extrato/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   ├── BancoLayout.jsx
│   │   │   └── BancoLayout.css
│   │   └── loja/
│   │       ├── pages/
│   │       │   ├── Login/
│   │       │   ├── Cadastro/
│   │       │   ├── Produtos/
│   │       │   ├── Carrinho/
│   │       │   ├── Pagamento/
│   │       │   ├── Pedidos/
│   │       │   ├── Admin/
│   │       │   ├── Estoque/
│   │       │   └── Perfil/
│   │       ├── components/
│   │       │   ├── LojaHeader/
│   │       │   ├── LojaMenu/
│   │       │   ├── ProductCard/
│   │       │   └── CarrinhoItem/
│   │       ├── services/
│   │       ├── hooks/
│   │       ├── LojaLayout.jsx
│   │       └── LojaLayout.css
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Home.css
│   ├── shared/
│   │   ├── components/
│   │   └── styles/
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## 🚀 Como Começar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

1. **Instale as dependências:**
```bash
cd Front-end
npm install
```

2. **Inicie o servidor de desenvolvimento:**
```bash
npm start
```

3. **Acesse a aplicação:**
```
http://localhost:3000
```

## 📖 Como Usar

### Página Inicial
Ao acessar a aplicação, você verá a página inicial com dois módulos:
- **Banco Digital** - Gerencie suas finanças
- **Loja Online** - Faça suas compras

### Banco Digital
1. Clique em "Banco Digital"
2. Faça login ou crie uma conta (use qualquer email/senha)
3. Acesse o Dashboard para visualizar seu saldo
4. Faça um depósito em "Depósito"
5. Visualize suas transações em "Transações"

### Loja Online
1. Clique em "Loja Online"
2. Crie uma conta (use "empresa@loja.com" para acesso administrativo)
3. Navegue pelo catálogo em "Produtos"
4. Adicione itens ao carrinho
5. Finalize a compra em "Pagamento"
6. Visualize seus pedidos em "Meus Pedidos"

### Acesso Administrativo
1. Faça login com email contendo "admin"
2. Acesse "Admin" para visualizar o dashboard
3. Use "Estoque" para gerenciar o inventário

## 🔐 Contextos Globais

### AuthContext
- Gerencia autenticação de usuários
- Controla login/logout
- Armazena informações do usuário

### BancoContext
- Gerencia saldo bancário
- Controla transações
- Processa pagamentos

### LojaContext
- Gerencia catálogo de produtos
- Controla carrinho de compras
- Gerencia pedidos e faturamento

## 🛠️ Principais Tecnologias

- **React** - Biblioteca JavaScript para UI
- **React Router** - Roteamento de páginas
- **Context API** - Gerenciamento de estado global
- **CSS3** - Estilização responsiva

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona bem em:
- Desktop
- Tablet
- Mobile

## 🎨 Paleta de Cores

- **Banco**: Azul profundo (#003087)
- **Loja**: Verde natural (#1a5c38)
- **Neutros**: Cinza e branco
- **Alertas**: Vermelho, amarelo, verde

## 📝 Notas Importantes

- A aplicação simula uma API - não há persistência de dados real
- Dados são armazenados apenas em memória durante a sessão
- Use localStorage se quiser adicionar persistência
- Admin pode acessar painel apenas se email contiver "admin"

## 🤝 Contribuindo

Para adicionar novas funcionalidades:
1. Mantenha a estrutura modular
2. Crie componentes reutilizáveis
3. Use os contextos globais para estado compartilhado
4. Siga a estrutura de pastas existente

## 📞 Suporte

Para dúvidas ou reportar bugs, abra uma issue no repositório.

---

