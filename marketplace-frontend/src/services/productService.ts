import { api } from './api';
import type { ProductProps } from '../components/ItemCard/ItemCard';

export interface ProductFilters {
  searchTerm?: string;
  typeFilter?: string;
  stateFilter?: string;
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  type: string;
  state: string;
  availability?: string;
}

export const productService = {
  getAll: async (filters?: ProductFilters): Promise<ProductProps[]> => {
    const params: Record<string, string> = {};
    if (filters?.searchTerm) params.name = filters.searchTerm;
    if (filters?.typeFilter) params.type = filters.typeFilter;
    if (filters?.stateFilter) params.state = filters.stateFilter;

    const response = await api.get<ProductProps[]>('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ProductProps> => {
    const response = await api.get<ProductProps>(`/products/${id}`);
    return response.data;
  },

  create: async (data: ProductData): Promise<ProductProps> => {
    const response = await api.post<ProductProps>('/products', data);
    return response.data;
  },

  update: async (id: string, data: Partial<ProductData>): Promise<ProductProps> => {
    const response = await api.put<ProductProps>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};