# ⚡ Guia Rápido de Funcionalidades

## 🏦 BANCO DIGITAL

### Login & Cadastro
- **Tela**: `/banco/login` | `/banco/signup`
- **Funcionalidades**: 
  - Login com email/senha
  - Registro de nova conta
  - Validação de dados

### Dashboard 📊
- **Tela**: `/banco/dashboard`
- **Exibe**: 
  - Saldo total
  - Estatísticas de transações
  - Créditos/Débitos
  - Extrato recente
  - Informações da conta

### Transações 📋
- **Tela**: `/banco/transacoes`
- **Funcionalidades**:
  - Ver histórico completo
  - Filtrar por tipo
  - Estatísticas de entrada/saída
  - Data e descrição detalhadas

### Depósito 💰
- **Tela**: `/banco/deposito`
- **Métodos**:
  - Débito
  - Crédito
  - PIX
  - Transferência Bancária
- **Funcionalidades**:
  - Adicionar fundos
  - Dados bancários
  - Atualizar saldo em tempo real

### Perfil 👤
- **Tela**: `/banco/perfil`
- **Funcionalidades**:
  - Ver informações pessoais
  - Alterar senha
  - Autenticação 2FA
  - Notificações
  - Logout

---

## 🛍️ LOJA ONLINE

### Login & Cadastro
- **Tela**: `/loja/login` | `/loja/signup`
- **Tipos de Conta**:
  - Cliente (acesso normal)
  - Admin (acesso completo)
- **Detecção**: Email contendo "admin" = acesso administrativo

### Produtos 📦
- **Tela**: `/loja/produtos`
- **Funcionalidades**:
  - Catálogo com 4 produtos padrão
  - Filtrar por categoria
  - Visualizar preço e estoque
  - Status: "Pouco estoque" / "Fora de estoque"
  - Adicionar ao carrinho com quantidade

### Carrinho 🛒
- **Tela**: `/loja/carrinho`
- **Funcionalidades**:
  - Ver itens selecionados
  - Aumentar/Diminuir quantidade
  - Remover produtos
  - Cálculo automático de total
  - Desconto 10% para compras > R$ 1.000
  - Frete grátis

### Pagamento 💳
- **Tela**: `/loja/pagamento`
- **Métodos Disponíveis**:
  - 🏦 Débito Bancário (integrado com Banco)
  - 💳 Cartão de Crédito
  - 📱 PIX
  - 🏷️ Boleto Bancário
- **Funcionalidades**:
  - Validação de saldo
  - Recibo de transação
  - Criação automática de pedido

### Meus Pedidos 📋
- **Tela**: `/loja/pedidos`
- **Informações**:
  - ID do pedido
  - Data
  - Itens
  - Total
  - Status (PENDING/PAID)
  - Botões: Ver Detalhes / Rastrear

### Estoque 📊 (Admin)
- **Tela**: `/loja/estoque`
- **Funcionalidades**:
  - Ver total em estoque
  - Editar quantidades
  - Status dos produtos
  - Alertas (Baixo/Fora)
  - Histórico de movimentações

### Admin Dashboard 👨‍💼 (Admin Only)
- **Tela**: `/loja/admin`
- **Exibe**:
  - Faturamento total
  - Número de pedidos
  - Total de produtos
  - Estoque total
  - Produtos com baixo estoque
  - Últimos pedidos

### Perfil 👤
- **Tela**: `/loja/perfil`
- **Funcionalidades**:
  - Informações pessoais
  - Endereço de entrega
  - Preferências de notificação
  - Acesso admin (se aplicável)
  - Logout

---

## 📊 FLUXO TÍPICO DE USO

### Cenário 1: Compra Simples
```
1. Ir para Loja → Login
2. Produtos → Adicionar item
3. Carrinho → Revisar
4. Pagamento → Escolher método
5. Pedidos → Ver status
```

### Cenário 2: Pagamento com Banco
```
1. Ir para Banco → Depositar R$ 1.000
2. Voltar para Loja → Comprar
3. Pagamento → Débito Bancário
4. Banco → Ver nova transação
```

### Cenário 3: Admin
```
1. Loja → Login com admin@email.com
2. Admin → Ver faturamento
3. Estoque → Ajustar quantidades
4. Perfil → Acesso às ferramentas
```

---

## 🔄 INTEGRAÇÃO BANCO + LOJA

### Contextos Conectados
- `AuthContext` - Autenticação compartilhada
- `BancoContext` - Saldo consultado no pagamento
- `LojaContext` - Pedido criado no banco

### Fluxo de Pagamento
```
Loja (calcularTotal)
  ↓
Pagamento (processarPagamento)
  ↓
BancoContext (deduz saldo)
  ↓
LojaContext (cria pedido)
  ↓
Pedidos (exibe confirmação)
```

---

## 🎯 ATALHOS ÚTEIS

### Banco
| Ação | Tecla |
|------|-------|
| Dashboard | `/banco/dashboard` |
| Depósito | `/banco/deposito` |
| Transações | `/banco/transacoes` |

### Loja
| Ação | Tecla |
|------|-------|
| Produtos | `/loja/produtos` |
| Carrinho | `/loja/carrinho` |
| Pagamento | `/loja/pagamento` |

---

## 💡 DICAS

### Para Testar Tudo
1. Banco → Depositar R$ 5.000
2. Loja → Adicionar 2 produtos
3. Pagamento → Ver integração
4. Banco → Ver débito

### Desconto Automático
- Compra acima de R$ 1.000 = 10% desconto
- Válido em Carrinho + Pagamento

### Admin Access
- Email deve conter "admin"
- Ex: `admin@loja.com`, `adm@email.com`

### Status de Pedidos
- **PENDING**: Criado, aguardando pagamento
- **PAID**: Pagamento confirmado

---

## ⚙️ CONFIGURAÇÕES

### Produtos Padrão
- Notebook Pro: R$ 3.500
- Mouse Gamer: R$ 250
- Teclado Mecânico: R$ 450
- Monitor 4K: R$ 1.800

### Saldo Inicial (Banco)
- Padrão: R$ 15.000

### Transação Demo
- Depósito inicial: R$ 15.000

---

## 🔍 TROUBLESHOOTING

### Não consigo fazer login
- Use qualquer email/senha (sem validação real)
- Exemplo: `teste@teste.com` / `123456`

### Não vejo o admin
- Email deve conter "admin"
- Tente: `admin@email.com` ou `adminstrador@mail.com`

### Falta saldo no banco
- Faça um depósito na tela "Depósito"
- Clique em "Depositar" com qualquer valor

### Carrinho vazio
- Volte a "Produtos"
- Clique em "Adicionar" para cada item
- Escolha a quantidade

---

**Aproveite! 🚀**
