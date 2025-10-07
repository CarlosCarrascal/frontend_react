import api from './api';
import type { Autor, AutorFormData, ApiResponse } from '../types/libro.types';

const autorService = {
  getAll: async (): Promise<ApiResponse<Autor[]>> => {
    const response = await api.get('/autores');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Autor>> => {
    const response = await api.get(`/autores/${id}`);
    return response.data;
  },

  create: async (data: AutorFormData): Promise<ApiResponse<Autor>> => {
    const response = await api.post('/autores', data);
    return response.data;
  },

  update: async (id: number, data: AutorFormData): Promise<ApiResponse<Autor>> => {
    const response = await api.put(`/autores/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/autores/${id}`);
    return response.data;
  },
};

export default autorService;

