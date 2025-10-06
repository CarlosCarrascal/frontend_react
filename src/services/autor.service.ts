import api from './api';
import type { Autor, AutorFormData, ApiResponse } from '../types/libro.types';

const autorService = {
  // Listar todos los autores (público)
  getAll: async (): Promise<ApiResponse<Autor[]>> => {
    const response = await api.get('/autores');
    return response.data;
  },

  // Obtener un autor por ID (público)
  getById: async (id: number): Promise<ApiResponse<Autor>> => {
    const response = await api.get(`/autores/${id}`);
    return response.data;
  },

  // Crear un nuevo autor (requiere autenticación)
  create: async (data: AutorFormData): Promise<ApiResponse<Autor>> => {
    const response = await api.post('/autores', data);
    return response.data;
  },

  // Actualizar un autor (requiere autenticación)
  update: async (id: number, data: AutorFormData): Promise<ApiResponse<Autor>> => {
    const response = await api.put(`/autores/${id}`, data);
    return response.data;
  },

  // Eliminar un autor (requiere rol admin)
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/autores/${id}`);
    return response.data;
  },
};

export default autorService;

