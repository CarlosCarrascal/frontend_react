// Tipos para Libros y Autores

export interface Autor {
  id_autor: number;
  nombre: string;
  pais: string;
  createdAt?: string;
  updatedAt?: string;
  libros?: Libro[];
}

export interface Libro {
  id_libro: number;
  titulo: string;
  anio: number;
  portada: string | null;
  id_autor: number;
  createdAt?: string;
  updatedAt?: string;
  autor?: {
    id_autor: number;
    nombre: string;
    pais: string;
  };
}

export interface AutorFormData {
  nombre: string;
  pais: string;
}

export interface LibroFormData {
  titulo: string;
  anio: number;
  id_autor: number;
  portada?: File | null;
  removeImage?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
  errores?: string[];
}

