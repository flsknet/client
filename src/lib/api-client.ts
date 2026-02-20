import type { CreateClientConfig } from "~/gen/api/client.gen";

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
