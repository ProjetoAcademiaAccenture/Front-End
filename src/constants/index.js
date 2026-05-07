export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const ROUTES = {
  LOGIN_SHOP: "loja/login",
  REGISTER: "loja/signup",
  PRODUCTS: "loja/productos",
  CART: "loja/carrinho",
  ADMIN: "loja/admin",
  ADMIN_PRODUCTS: "loja/admin/productos",
  PAYMENT_PIX: "loja/checkout/pix",
  PAYMENT_BOLETO: "loja/checkout/boleto",
  PAYMENT_CARD: "loja/checkout/cartao",
  LOGIN_BANK: "banco/login",
  REGISTER_BANK: "banco/signup",
};

export const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user",
  CART: "cart_items",
};

export const PAYMENT_METHODS = {
  PIX: "pix",
  BOLETO: "boleto",
  CARD: "cartao",
};
