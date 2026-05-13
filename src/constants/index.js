export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const ROUTES = {
  LOGIN_SHOP: "loja/login",
  REGISTER: "loja/signup",
  PRODUCTS: "loja/produtos",
  ORDERS: "loja/pedidos",
  CART: "loja/carrinho",
  ADMIN: "loja/admin",
  ADMIN_PRODUCTS: "loja/admin/produtos",
  PAYMENT_PIX: "loja/checkout/pix",
  PAYMENT_BOLETO: "loja/checkout/boleto",
  PAYMENT_CARD: "loja/checkout/cartao",
  LOGIN_BANK: "banco/login",
  REGISTER_BANK: "banco/signup",
  BANK_DASHBOARD: "banco/dashboard",
};

export const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user",
  CART: "cart_items",
};

export const PAYMENT_METHODS = {
  PIX: "PIX",
  BOLETO: "BOLETO",
  CREDITO: "CREDITO",
  DEBITO: "DEBITO",
};
