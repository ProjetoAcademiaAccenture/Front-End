# Guia de Instalação - E-Commerce System

## Passo 1: Preparar Ambiente

### Windows
1. Abra o PowerShell ou CMD
2. Navegue até a pasta do projeto:
   ```bash
   cd "Área de Trabalho/Accenture/projeto/Front-end"
   ```

### macOS/Linux
1. Abra o Terminal
2. Navegue até a pasta do projeto:
   ```bash
   cd ~/Área\ de\ Trabalho/Accenture/projeto/Front-end
   ```

## Passo 2: Instalar Dependências

```bash
npm install
```

Isso instalará:
- React 18.2.0
- React Router DOM 6.8.0
- Axios 1.3.0
- React Scripts 5.0.1

## Passo 3: Iniciar o Servidor

```bash
npm start
```

O navegador abrirá automaticamente em `http://localhost:3000`

## Passo 4: Explorar a Aplicação

### Primeira Visita
1. A página inicial mostrará dois módulos: Banco e Loja
2. Clique em "Banco Digital" ou "Loja Online" para começar

### No Banco
- Email: qualquer email (ex: usuario@email.com)
- Senha: qualquer senha (ex: senha123)
- Clique em "Entrar"

### Na Loja
- Email: qualquer email (ex: user@email.com)
- Senha: qualquer senha
- Para acesso admin, use email com "admin" (ex: empresa@loja.com)

## Dicas

### Fluxo Recomendado
1. **Banco** → Login → Fazer Depósito → Ver Dashboard
2. **Loja** → Login → Ver Produtos → Adicionar ao Carrinho → Pagamento

### Demonstração Completa
```
1. Ir para Banco
   - Login: demo@banco.com / senha
   - Depositar: R$ 5.000
   - Ver transações

2. Ir para Loja
   - Login: cliente@loja.com / senha
   - Adicionar 2x Notebook Pro ao carrinho
   - Finalizar compra
   - Ver pedidos

3. Voltar ao Banco
   - Verificar nova transação de débito
   - Saldo será menor
```

## Troubleshooting

### Erro: "npm command not found"
- Instale Node.js de https://nodejs.org/
- Reinicie o terminal
- Verifique com `npm --version`

### Erro: "Port 3000 already in use"
- Use uma porta diferente:
  ```bash
  PORT=3001 npm start
  ```

### Erro: Module not found
- Delete a pasta `node_modules`:
  ```bash
  rm -rf node_modules
  ```
- Reinstale:
  ```bash
  npm install
  ```

### Página em branco
- Abra o DevTools (F12)
- Verifique se há erros no console
- Limpe o cache do navegador (Ctrl+Shift+Del)

## Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar modo desenvolvimento
npm start

# Build para produção
npm build

# Rodar testes
npm test
```

## Estrutura de Arquivos Importante

```
src/
├── context/          # Estado global
├── modules/
│   ├── banco/        # Sistema bancário
│   └── loja/         # Sistema de loja
├── pages/            # Páginas principais
└── App.jsx          # Componente raiz
```

## Recursos do Sistema

### Banco Digital
- ✅ Autenticação
- ✅ Dashboard com saldo
- ✅ Histórico de transações
- ✅ Depósitos
- ✅ Perfil de usuário

### Loja Online
- ✅ Catálogo de produtos
- ✅ Carrinho de compras
- ✅ Checkout com múltiplos pagamentos
- ✅ Histórico de pedidos
- ✅ Painel administrativo
- ✅ Gerenciar estoque

## Próximos Passos

Após instalar, você pode:
1. Explorar a aplicação
2. Modificar estilos em arquivos `.css`
3. Adicionar novos produtos em `BancoContext.jsx` ou `LojaContext.jsx`
4. Criar novos componentes mantendo a estrutura

## Suporte

Dúvidas? Verifique:
- README.md - Documentação geral
- Estrutura de pastas - Entender a organização
- Comentários no código - Explicações inline

---

**Diversão codificando! 🚀**
