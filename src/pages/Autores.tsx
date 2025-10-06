import React, { useEffect, useState } from 'react';
import autorService from '../services/autor.service';
import type { Autor, AutorFormData } from '../types/libro.types';
import AutorCard from '../components/AutorCard';
import AutorModal from '../components/AutorModal';
import { useAuth } from '../context/AuthContext';

const Autores: React.FC = () => {
  const { hasRole } = useAuth();
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAutor, setSelectedAutor] = useState<Autor | null>(null);
  const [error, setError] = useState('');
  const isAdmin = hasRole('ADMIN');

  const fetchAutores = async () => {
    try {
      setLoading(true);
      const response = await autorService.getAll();
      setAutores(response.data || []);
    } catch (error) {
      console.error('Error al cargar autores:', error);
      setError('Error al cargar los autores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutores();
  }, []);

  const handleCreate = () => {
    setSelectedAutor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (autor: Autor) => {
    setSelectedAutor(autor);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: AutorFormData) => {
    try {
      if (selectedAutor) {
        await autorService.update(selectedAutor.id_autor, data);
      } else {
        await autorService.create(data);
      }
      await fetchAutores();
      setIsModalOpen(false);
    } catch (error: any) {
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este autor?')) return;

    try {
      await autorService.delete(id);
      await fetchAutores();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar el autor');
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
                Gestión de Autores
              </h1>
              <p className="text-slate-600">
                Administra los autores de la biblioteca
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Autor
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
        ) : autores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {autores.map((autor) => (
              <AutorCard
                key={autor.id_autor}
                autor={autor}
                onEdit={handleEdit}
                onDelete={isAdmin ? handleDelete : undefined}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No hay autores registrados
            </h3>
            <p className="text-slate-600 mb-6">
              Comienza agregando el primer autor
            </p>
            <button
              onClick={handleCreate}
              className="px-6 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Agregar Autor
            </button>
          </div>
        )}

        {/* Modal */}
        <AutorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          autor={selectedAutor}
        />
      </div>
    </div>
  );
};

export default Autores;

