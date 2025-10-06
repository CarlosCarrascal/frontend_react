import React, { useEffect, useState } from 'react';
import libroService from '../services/libro.service';
import autorService from '../services/autor.service';
import type { Libro, Autor } from '../types/libro.types';
import LibroCard from '../components/LibroCard';
import Pagination from '../components/Pagination';

const Biblioteca: React.FC = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAutor, setSelectedAutor] = useState<number>(0);
  const [yearFilter, setYearFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'year'>('recent');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [librosRes, autoresRes] = await Promise.all([
          libroService.getAll(),
          autorService.getAll(),
        ]);
        setLibros(librosRes.data || []);
        setAutores(autoresRes.data || []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar y ordenar libros
  const getFilteredAndSortedLibros = () => {
    let filtered = [...libros];

    // Búsqueda por título
    if (searchTerm) {
      filtered = filtered.filter((libro) =>
        libro.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por autor
    if (selectedAutor !== 0) {
      filtered = filtered.filter((libro) => libro.id_autor === selectedAutor);
    }

    // Filtro por año
    if (yearFilter) {
      filtered = filtered.filter((libro) => libro.anio.toString() === yearFilter);
    }

    // Ordenar
    switch (sortBy) {
      case 'title':
        filtered.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'year':
        filtered.sort((a, b) => b.anio - a.anio);
        break;
      case 'recent':
      default:
        // Ya viene ordenado por id_libro DESC del backend
        break;
    }

    return filtered;
  };

  const filteredLibros = getFilteredAndSortedLibros();
  const totalPages = Math.ceil(filteredLibros.length / itemsPerPage);
  const paginatedLibros = filteredLibros.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Obtener años únicos para el filtro
  const uniqueYears = Array.from(new Set(libros.map((l) => l.anio)))
    .sort((a, b) => b - a);

  // Reset página cuando cambian filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedAutor, yearFilter, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAutor(0);
    setYearFilter('');
    setSortBy('recent');
  };

  const hasActiveFilters = searchTerm || selectedAutor !== 0 || yearFilter || sortBy !== 'recent';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Biblioteca Completa
          </h1>
          <p className="text-slate-600">
            Explora nuestra colección de {libros.length} libros
          </p>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Búsqueda */}
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">
                Buscar libro
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Título del libro..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filtro por Autor */}
            <div>
              <label htmlFor="autor" className="block text-sm font-medium text-slate-700 mb-2">
                Autor
              </label>
              <select
                id="autor"
                value={selectedAutor}
                onChange={(e) => setSelectedAutor(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value={0}>Todos los autores</option>
                {autores.map((autor) => (
                  <option key={autor.id_autor} value={autor.id_autor}>
                    {autor.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Año */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-slate-700 mb-2">
                Año
              </label>
              <select
                id="year"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="">Todos los años</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ordenar y Limpiar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-slate-700">
                Ordenar por:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="recent">Más recientes</option>
                <option value="title">Título (A-Z)</option>
                <option value="year">Año (nuevo-viejo)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <p className="text-sm text-slate-600">
            Mostrando {paginatedLibros.length} de {filteredLibros.length} libro(s)
            {hasActiveFilters && ' (filtrados)'}
          </p>
        </div>

        {/* Grid de Libros */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          </div>
        ) : paginatedLibros.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedLibros.map((libro) => (
                <LibroCard key={libro.id_libro} libro={libro} />
              ))}
            </div>

            {/* Paginación */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-slate-600 mb-4">
              Intenta ajustar los filtros de búsqueda
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Biblioteca;

