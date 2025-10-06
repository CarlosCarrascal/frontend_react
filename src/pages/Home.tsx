import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import libroService from '../services/libro.service';
import type { Libro } from '../types/libro.types';
import LibroCard from '../components/LibroCard';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await libroService.getAll();
        setLibros(response.data || []);
      } catch (error) {
        console.error('Error al cargar libros:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibros();
  }, []);

  const totalPages = Math.ceil(libros.length / itemsPerPage);
  const paginatedLibros = libros.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 mb-8">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Biblioteca Digital
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explora nuestra colección de libros y autores de todo el mundo
          </p>
        </div>

        {/* User Info */}
        {user && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {user.username.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    Hola, {user.username}
                  </h3>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="border border-amber-200 bg-amber-50 rounded-2xl p-6">
              <p className="text-amber-900">
                <span className="font-semibold">No has iniciado sesión.</span>{' '}
                <Link to="/login" className="underline hover:text-amber-700">
                  Inicia sesión
                </Link>{' '}
                o{' '}
                <Link to="/register" className="underline hover:text-amber-700">
                  crea una cuenta
                </Link>{' '}
                para leer nuestros libros, ¿listo para comenzar?.
              </p>
            </div>
          </div>
        )}

        {/* Libros Section */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Últimos Libros
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Mostrando {paginatedLibros.length} de {libros.length} libros
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/biblioteca"
                className="px-4 py-2 text-sm font-semibold text-slate-900 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl transition-colors"
              >
                Ver Todos
              </Link>
              {isAuthenticated && (
                <Link
                  to="/user"
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Gestionar
                </Link>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
          ) : paginatedLibros.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {paginatedLibros.map((libro) => (
                  <LibroCard key={libro.id_libro} libro={libro} />
                ))}
              </div>

              {/* Paginación Simple */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-sm text-slate-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No hay libros disponibles
              </h3>
              <p className="text-slate-600">
                {isAuthenticated 
                  ? 'Sé el primero en agregar un libro a la biblioteca' 
                  : 'Inicia sesión para agregar libros'}
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        {!isAuthenticated && (
          <div className="max-w-3xl mx-auto text-center">
            <div className="border border-slate-200 rounded-2xl p-12 bg-slate-50">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                ¿Listo para comenzar?
              </h2>
              <p className="text-slate-600 mb-8">
                Crea tu cuenta y empieza a gestionar libros y autores
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-3 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Crear cuenta
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 text-base font-semibold text-slate-900 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl transition-colors"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
