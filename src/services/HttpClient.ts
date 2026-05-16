import { StorageKeys } from '@/configs/StorageKeys';
import axios from 'axios';
import { AuthService } from './AuthService';

export const HttpClient = axios.create({
  baseURL: 'http://localhost:3000',
});

HttpClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(StorageKeys.accessToken);

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return config;
});

HttpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem(StorageKeys.refreshToken);

    if (originalRequest.url === '/refresh-token') {
      window.location.href = '/sign-in';
      localStorage.clear();
      return Promise.reject(error);
    }

    if ((error.response && error.response.status !== 401) || !refreshToken) {
      return Promise.reject(error);
    }

    const {
      accessToken,
      refreshToken: newRefreshToken
    } = await AuthService.refreshToken(refreshToken);

    localStorage.setItem(StorageKeys.accessToken, accessToken);
    localStorage.setItem(StorageKeys.refreshToken, newRefreshToken);

    return HttpClient(originalRequest);
  }
);
