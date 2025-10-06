import React, { useState, useEffect } from 'react';
import type { Autor, AutorFormData } from '../types/libro.types';

interface AutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AutorFormData) => Promise<void>;
  autor?: Autor | null;
}

const AutorModal: React.FC<AutorModalProps> = ({ isOpen, onClose, onSubmit, autor }) => {
  const [formData, setFormData] = useState<AutorFormData>({
    nombre: '',
    pais: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (autor) {
      setFormData({
        nombre: autor.nombre,
        pais: autor.pais,
      });
    } else {
      setFormData({ nombre: '', pais: '' });
    }
    setError('');
  }, [autor, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al guardar el autor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {autor ? 'Editar Autor' : 'Nuevo Autor'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-2">
              Nombre del Autor *
            </label>
            <input
              type="text"
              id="nombre"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="Gabriel García Márquez"
            />
          </div>

          <div>
            <label htmlFor="pais" className="block text-sm font-medium text-slate-700 mb-2">
              País *
            </label>
            <input
              type="text"
              id="pais"
              required
              value={formData.pais}
              onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="Colombia"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : autor ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutorModal;

