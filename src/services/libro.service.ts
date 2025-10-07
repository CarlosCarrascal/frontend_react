import api from './api';
import type { Libro, LibroFormData, ApiResponse } from '../types/libro.types';

const libroService = {
  getAll: async (): Promise<ApiResponse<Libro[]>> => {
    const response = await api.get('/libros');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Libro>> => {
    const response = await api.get(`/libros/${id}`);
    return response.data;
  },

  create: async (data: LibroFormData): Promise<ApiResponse<Libro>> => {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('anio', data.anio.toString());
    formData.append('id_autor', data.id_autor.toString());
    
    if (data.portada) {
      formData.append('portada', data.portada);
    }

    const response = await api.post('/libros', formData);
    return response.data;
  },

  update: async (id: number, data: LibroFormData): Promise<ApiResponse<Libro>> => {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('anio', data.anio.toString());
    formData.append('id_autor', data.id_autor.toString());
    
    if (data.portada) {
      formData.append('portada', data.portada);
    }
    
    if (data.removeImage) {
      formData.append('removeImage', 'true');
    }

    const response = await api.put(`/libros/${id}`, formData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/libros/${id}`);
    return response.data;
  },

  getImageUrl: (filename: string | null): string => {
    if (!filename) return '';
    
    // Si ya es una URL completa (de Cloudinary), devolverla tal cual
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    
    // Si es un nombre de archivo antiguo (legacy), construir la URL del servidor
    return `https://backend-node-khgr.onrender.com/uploads/${filename}`;
  },
};

export default libroService;

