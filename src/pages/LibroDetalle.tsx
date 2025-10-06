import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import libroService from '../services/libro.service';
import type { Libro } from '../types/libro.types';

const LibroDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [libro, setLibro] = useState<Libro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLibro = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await libroService.getById(parseInt(id));
        setLibro(response.data || null);
      } catch (err: any) {
        console.error('Error al cargar el libro:', err);
        setError('No se pudo cargar la información del libro');
      } finally {
        setLoading(false);
      }
    };

    fetchLibro();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !libro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Libro no encontrado</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">{error || 'El libro que buscas no existe o ha sido eliminado'}</p>
          <Link
            to="/biblioteca"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la biblioteca
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/home" className="text-slate-500 hover:text-slate-900 transition-colors">
                Inicio
              </Link>
            </li>
            <li className="text-slate-400">/</li>
            <li>
              <Link to="/biblioteca" className="text-slate-500 hover:text-slate-900 transition-colors">
                Biblioteca
              </Link>
            </li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-900 font-medium truncate max-w-xs">{libro.titulo}</li>
          </ol>
        </nav>

        {/* Contenido principal */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Columna izquierda - Imagen (2 columnas) */}
            <div className="lg:col-span-2 bg-slate-50 p-8 lg:p-12 flex items-center justify-center">
              <div className="w-full max-w-sm">
                {libro.portada ? (
                  <div className="relative">
                    <img
                      src={libroService.getImageUrl(libro.portada)}
                      alt={libro.titulo}
                      className="w-full rounded-2xl shadow-2xl object-contain"
                      style={{ maxHeight: '600px' }}
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-24 h-24 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Columna derecha - Información (3 columnas) */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-block px-4 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full mb-4">
                  {libro.anio}
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  {libro.titulo}
                </h1>
                
                {/* Información del autor */}
                {libro.autor && (
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {libro.autor.nombre.substring(0, 1)}
                      </span>
                    </div>
                    <div>
                      <Link 
                        to={`/biblioteca?autor=${libro.autor.id_autor}`}
                        className="text-lg font-semibold text-slate-900 hover:text-slate-700 transition-colors block"
                      >
                        {libro.autor.nombre}
                      </Link>
                      <p className="text-sm text-slate-500">{libro.autor.pais}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Separador */}
              <div className="border-t border-slate-200 my-8"></div>

              {/* Descripción */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Sobre este libro</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed">
                    Bienvenido a la lectura de <span className="font-semibold text-slate-900">{libro.titulo}</span>. 
                    Este libro está disponible de forma exclusiva para usuarios registrados en nuestra plataforma.
                  </p>
                </div>
              </div>

              {/* Detalles técnicos */}
              <div className="bg-slate-50 rounded-2xl p-6 mb-8">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                  Información del libro
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Título</p>
                    <p className="text-sm font-medium text-slate-900">{libro.titulo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Año de publicación</p>
                    <p className="text-sm font-medium text-slate-900">{libro.anio}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Autor</p>
                    <p className="text-sm font-medium text-slate-900">{libro.autor?.nombre}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">País</p>
                    <p className="text-sm font-medium text-slate-900">{libro.autor?.pais}</p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Volver
                </button>
                <Link
                  to="/biblioteca"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Explorar más libros
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibroDetalle;
