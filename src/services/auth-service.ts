import getApiInstance from './api-client';
import { AuthRequest, RegisterRequest, AuthResponse, BankRegisterRequest } from '../types';

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await getApiInstance().post('/auth/register', data);
    return response.data;
  },

  login: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await getApiInstance().post('/auth/login', data);
    return response.data;
  },

  registerBank: async (data: BankRegisterRequest): Promise<AuthResponse> => {
    const response = await getApiInstance().post('/auth/register-bank', data);
    return response.data;
  },

  loginBank: async (numeroConta: string, senha: string): Promise<AuthResponse> => {
    const response = await getApiInstance().post('/auth/login-bank', {
      numero_conta: numeroConta,
      senha,
    });
    return response.data;
  },
};
