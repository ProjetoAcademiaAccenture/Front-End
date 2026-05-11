import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'http://localhost:8080';

let apiInstance: AxiosInstance | null = null;

export const getApiInstance = (): AxiosInstance => {
  if (!apiInstance) {
    apiInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    apiInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    apiInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  return apiInstance;
};

export default getApiInstance;
