import { create } from 'zustand';
import { CartItem, Produto } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (produtoId: number) => void;
  updateQuantity: (produtoId: number, quantidade: number) => void;
  clear: () => void;
  getTotal: () => number;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item: CartItem) => {
    const items = get().items;
    const existing = items.find((i) => i.produtoId === item.produtoId);
    
    if (existing) {
      existing.quantidade += item.quantidade;
    } else {
      items.push(item);
    }
    
    set({ items });
    get().saveToStorage();
  },

  removeItem: (produtoId: number) => {
    set({ items: get().items.filter((i) => i.produtoId !== produtoId) });
    get().saveToStorage();
  },

  updateQuantity: (produtoId: number, quantidade: number) => {
    const items = get().items;
    const item = items.find((i) => i.produtoId === produtoId);
    if (item) {
      item.quantidade = quantidade;
    }
    set({ items });
    get().saveToStorage();
  },

  clear: () => {
    set({ items: [] });
    localStorage.removeItem('cart');
  },

  getTotal: () => {
    return get().items.reduce((total, item) => total + (item.produto?.preco || 0) * item.quantidade, 0);
  },

  loadFromStorage: () => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        set({ items: JSON.parse(stored) });
      } catch (e) {
        console.error('Failed to load cart from storage:', e);
      }
    }
  },

  saveToStorage: () => {
    localStorage.setItem('cart', JSON.stringify(get().items));
  },
}));
