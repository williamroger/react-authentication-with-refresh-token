import { StorageKeys } from '@/configs/StorageKeys';
import axios from 'axios';

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
