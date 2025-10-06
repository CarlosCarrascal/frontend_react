import React, { useEffect, useState } from 'react';
import libroService from '../services/libro.service';
import autorService from '../services/autor.service';
import type { Libro, Autor, LibroFormData } from '../types/libro.types';
import LibroCard from '../components/LibroCard';
import LibroModal from '../components/LibroModal';

const User: React.FC = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);
  const [error, setError] = useState('');

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
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setSelectedLibro(null);
    setIsModalOpen(true);
  };

  const handleEdit = (libro: Libro) => {
    setSelectedLibro(libro);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: LibroFormData) => {
    try {
      if (selectedLibro) {
        await libroService.update(selectedLibro.id_libro, data);
      } else {
        await libroService.create(data);
      }
      await fetchData();
      setIsModalOpen(false);
    } catch (error: any) {
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este libro?')) return;

    try {
      await libroService.delete(id);
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar el libro');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Gestión de Libros
              </h1>
              <p className="text-slate-600">
                Administra tu colección de libros
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Libro
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          </div>
        ) : libros.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {libros.map((libro) => (
              <LibroCard
                key={libro.id_libro}
                libro={libro}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No hay libros registrados
            </h3>
            <p className="text-slate-600 mb-6">
              Comienza agregando tu primer libro
            </p>
            <button
              onClick={handleCreate}
              className="px-6 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Agregar Libro
            </button>
          </div>
        )}

        {/* Modal */}
        <LibroModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          libro={selectedLibro}
          autores={autores}
        />
      </div>
    </div>
  );
};

export default User;
