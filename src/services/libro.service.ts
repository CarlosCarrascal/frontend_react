import api from './api';
import type { Libro, LibroFormData, ApiResponse } from '../types/libro.types';

const libroService = {
  // Listar todos los libros (público)
  getAll: async (): Promise<ApiResponse<Libro[]>> => {
    const response = await api.get('/libros');
    return response.data;
  },

  // Obtener un libro por ID (público)
  getById: async (id: number): Promise<ApiResponse<Libro>> => {
    const response = await api.get(`/libros/${id}`);
    return response.data;
  },

  // Crear un nuevo libro con imagen (requiere autenticación)
  create: async (data: LibroFormData): Promise<ApiResponse<Libro>> => {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('anio', data.anio.toString());
    formData.append('id_autor', data.id_autor.toString());
    
    if (data.portada) {
      formData.append('portada', data.portada);
    }

    const response = await api.post('/libros', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Actualizar un libro (requiere autenticación)
  update: async (id: number, data: LibroFormData): Promise<ApiResponse<Libro>> => {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('anio', data.anio.toString());
    formData.append('id_autor', data.id_autor.toString());
    
    // Si hay nueva imagen, agregarla
    if (data.portada) {
      formData.append('portada', data.portada);
    }
    
    // Si se debe eliminar la imagen actual
    if (data.removeImage) {
      formData.append('removeImage', 'true');
    }

    const response = await api.put(`/libros/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Eliminar un libro (requiere rol admin)
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/libros/${id}`);
    return response.data;
  },

  // Helper para obtener URL de imagen
  getImageUrl: (filename: string | null): string => {
    if (!filename) return '/placeholder-book.png';
    return `https://backend-node-khgr.onrender.com/uploads/${filename}`;
  },
};

export default libroService;

