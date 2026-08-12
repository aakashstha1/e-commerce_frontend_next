import { useAuthStore } from '@/store/auth-store';
import { ApiEnvelope } from '@/types';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export const apiClient = axios.create({ baseURL: API_URL });

// A second, "raw" instance used only for the refresh call itself — avoids
// re-triggering the response interceptor's refresh logic recursively.
const refreshClient = axios.create({ baseURL: API_URL });

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function resolveQueue(token: string | null) {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  // Unwrap the backend's { success, data, ... } envelope so callers just get `data`.
  (response) => {
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = (response.data as ApiEnvelope<unknown>).data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/signup') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      const { refreshToken, clearAuth, setTokens } = useAuthStore.getState();

      if (!refreshToken) {
        clearAuth();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Another request already triggered a refresh; wait for it to finish.
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) return reject(error);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await refreshClient.post(
          '/auth/refresh',
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } },
        );
        const tokens = data.data ?? data; // handle envelope either way
        setTokens(tokens);
        resolveQueue(tokens.accessToken);
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        resolveQueue(null);
        clearAuth();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

/** Extracts a human-readable message from a failed API call, for toasts/form errors. */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(', ') : data.message;
    }
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
