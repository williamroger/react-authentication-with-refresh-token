import { createContext, useCallback, useLayoutEffect, useState } from 'react';
import { AuthService } from '@/services/AuthService';
import { HttpClient } from '@/services/HttpClient';
import { StorageKeys } from '@/configs/StorageKeys';

interface IAuthContextValue {
  signedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext({} as IAuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(() => {
    return Boolean(localStorage.getItem('live19:accessToken'));
  });

  const signIn = useCallback(async (email: string, password: string) => {
    const { accessToken, refreshToken } = await AuthService.signIn({
      email,
      password,
    });

    localStorage.setItem('live19:accessToken', accessToken);
    localStorage.setItem('live19:refreshToken', refreshToken);

    setSignedIn(true);
  }, []);

  const signOut = useCallback(() => {
    localStorage.clear();

    setSignedIn(false);
  }, []);

  const value: IAuthContextValue = {
    signedIn,
    signIn,
    signOut,
  };

  useLayoutEffect(() => {
    const requestInterceptorId = HttpClient.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem(StorageKeys.accessToken);

      if (accessToken) {
        config.headers.set('Authorization', `Bearer ${accessToken}`);
      }

      return config;
    });

    return () => {
      HttpClient.interceptors.request.eject(requestInterceptorId);
    };
  }, [])

  useLayoutEffect(() => {
    const responseInterceptorId = HttpClient.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem(StorageKeys.refreshToken);

        if (originalRequest.url === '/refresh-token') {
          setSignedIn(false);
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

    return () => {
      HttpClient.interceptors.response.eject(responseInterceptorId);
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
