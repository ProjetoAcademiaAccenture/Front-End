import { useContext } from 'react';
import { LojaContext } from '../../../context/LojaContext';

export const useLojaContext = () => {
  const context = useContext(LojaContext);

  if (!context) {
    throw new Error('useLojaContext deve ser usado dentro de LojaProvider');
  }

  return context;
};
