import { useContext } from 'react';
import { BancoContext } from '../../../context/BancoContext';

export const useBanco = () => {
  const context = useContext(BancoContext);

  if (!context) {
    throw new Error('useBanco deve ser usado dentro de BancoProvider');
  }

  return context;
};
