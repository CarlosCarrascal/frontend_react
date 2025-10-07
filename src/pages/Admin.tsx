import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import libroService from '../services/libro.service';
import autorService from '../services/autor.service';
import type { Libro, Autor } from '../types/libro.types';

const Admin: React.FC = () => {
  const [stats, setStats] = useState({
    totalLibros: 0,
    totalAutores: 0,
    librosRecientes: [] as Libro[],
    autoresRecientes: [] as Autor[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [librosRes, autoresRes] = await Promise.all([
          libroService.getAll(),
          autorService.getAll(),
        ]);

        const libros = librosRes.data || [];
        const autores = autoresRes.data || [];

        setStats({
          totalLibros: libros.length,
          totalAutores: autores.length,
          librosRecientes: libros.slice(0, 5),
          autoresRecientes: autores.slice(0, 5),
        });
      } catch (error) {
        // Error al cargar estadísticas
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-slate-600">
            Vista general del sistema de biblioteca
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Libros</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalLibros}</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Autores</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalAutores}</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Books */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Libros Recientes</h2>
            {stats.librosRecientes.length > 0 ? (
              <div className="space-y-3">
                {stats.librosRecientes.map((libro) => (
                  <div key={libro.id_libro} className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {libro.titulo}
                      </p>
                      <p className="text-xs text-slate-600">
                        {libro.autor?.nombre} - {libro.anio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No hay libros registrados</p>
            )}
          </div>

          {/* Recent Authors */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Autores Recientes</h2>
            {stats.autoresRecientes.length > 0 ? (
              <div className="space-y-3">
                {stats.autoresRecientes.map((autor) => (
                  <div key={autor.id_autor} className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">
                        {autor.nombre.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {autor.nombre}
                      </p>
                      <p className="text-xs text-slate-600">{autor.pais}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No hay autores registrados</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/libros"
              className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-slate-200 transition-colors">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Gestionar Libros</p>
                <p className="text-xs text-slate-600">Administrar biblioteca</p>
              </div>
            </Link>

            <Link
              to="/admin/autores"
              className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-slate-200 transition-colors">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Gestionar Autores</p>
                <p className="text-xs text-slate-600">Administrar autores</p>
              </div>
            </Link>

            <Link
              to="/biblioteca"
              className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-slate-200 transition-colors">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Ver Biblioteca</p>
                <p className="text-xs text-slate-600">Vista pública</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
