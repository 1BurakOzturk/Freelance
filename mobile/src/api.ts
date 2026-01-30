import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  token: 'auth:token:v1',
} as const;

// NOTE:
// - If you use `adb reverse tcp:4000 tcp:4000`, emulator can reach backend via 127.0.0.1.
// - Otherwise, use http://10.0.2.2:4000 for Android emulator.
// - On real device, set this to your LAN IP.
export const API_BASE_URL = 'http://127.0.0.1:4000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.token);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export type User = { id: string; email: string };
export type AuthResponse = { token: string; user: User };

export type Client = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  notes?: string | null;
};

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';

export type Invoice = {
  id: string;
  clientId: string;
  title: string;
  amountCents: number;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidAt?: string | null;
  notes?: string | null;
  client?: Client;
};

export const authApi = {
  async register(email: string, password: string) {
    const { data } = await api.post<AuthResponse>('/auth/register', { email, password });
    return data;
  },
  async login(email: string, password: string) {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },
};

export const clientsApi = {
  async list() {
    const { data } = await api.get<{ items: Client[] }>('/clients');
    return data.items;
  },
  async create(input: { name: string; email?: string }) {
    const { data } = await api.post<{ item: Client }>('/clients', input);
    return data.item;
  },
  async remove(id: string) {
    const { data } = await api.delete<{ ok: boolean }>(`/clients/${id}`);
    return data.ok;
  },
};

export const invoicesApi = {
  async list() {
    const { data } = await api.get<{ items: Invoice[] }>('/invoices');
    return data.items;
  },
  async create(input: {
    clientId: string;
    title: string;
    amountCents: number;
    currency: string;
    dueDate: string;
    notes?: string;
  }) {
    const { data } = await api.post<{ item: Invoice }>('/invoices', input);
    return data.item;
  },
  async update(id: string, patch: Partial<Pick<Invoice, 'title' | 'amountCents' | 'currency' | 'status' | 'notes' | 'paidAt' | 'dueDate'>>) {
    const { data } = await api.patch<{ item: Invoice }>(`/invoices/${id}`, patch);
    return data.item;
  },
};
