import React, { useState, useEffect } from 'react';
import type { Libro, LibroFormData, Autor } from '../types/libro.types';
import libroService from '../services/libro.service';

interface LibroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LibroFormData) => Promise<void>;
  libro?: Libro | null;
  autores: Autor[];
}

const LibroModal: React.FC<LibroModalProps> = ({ isOpen, onClose, onSubmit, libro, autores }) => {
  const [formData, setFormData] = useState<LibroFormData>({
    titulo: '',
    anio: new Date().getFullYear(),
    id_autor: 0,
    portada: null,
  });
  const [previewImage, setPreviewImage] = useState<string>('');
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (libro) {
      setFormData({
        titulo: libro.titulo,
        anio: libro.anio,
        id_autor: libro.id_autor,
        portada: null,
      });
      if (libro.portada) {
        setPreviewImage(libroService.getImageUrl(libro.portada));
      } else {
        setPreviewImage('');
      }
      setRemoveCurrentImage(false);
    } else {
      setFormData({
        titulo: '',
        anio: new Date().getFullYear(),
        id_autor: autores.length > 0 ? autores[0].id_autor : 0,
        portada: null,
      });
      setPreviewImage('');
      setRemoveCurrentImage(false);
    }
    setError('');
  }, [libro, isOpen, autores]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, portada: file });
      setRemoveCurrentImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSubmit = {
        ...formData,
        removeImage: removeCurrentImage,
      };
      await onSubmit(dataToSubmit);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al guardar el libro');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {libro ? 'Editar Libro' : 'Nuevo Libro'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna izquierda - Formulario */}
            <div className="space-y-4">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-slate-700 mb-2">
                  Título del Libro *
                </label>
                <input
                  type="text"
                  id="titulo"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="Cien años de soledad"
                />
              </div>

              <div>
                <label htmlFor="anio" className="block text-sm font-medium text-slate-700 mb-2">
                  Año de Publicación *
                </label>
                <input
                  type="number"
                  id="anio"
                  required
                  min="1000"
                  max={new Date().getFullYear() + 1}
                  value={formData.anio}
                  onChange={(e) => setFormData({ ...formData, anio: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="id_autor" className="block text-sm font-medium text-slate-700 mb-2">
                  Autor *
                </label>
                <select
                  id="id_autor"
                  required
                  value={formData.id_autor}
                  onChange={(e) => setFormData({ ...formData, id_autor: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <option value={0}>Seleccione un autor</option>
                  {autores.map((autor) => (
                    <option key={autor.id_autor} value={autor.id_autor}>
                      {autor.nombre} ({autor.pais})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Columna derecha - Imagen */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Portada del Libro
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-slate-400 transition-colors">
                {previewImage && !removeCurrentImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage('');
                        setFormData({ ...formData, portada: null });
                        // Si es edición y tiene imagen original, marcar para eliminar
                        if (libro?.portada && !formData.portada) {
                          setRemoveCurrentImage(true);
                        }
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Eliminar imagen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-64 cursor-pointer group">
                    <svg className="w-12 h-12 text-slate-400 group-hover:text-slate-600 mb-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-slate-600 group-hover:text-slate-900 text-center mb-2 transition-colors">
                      Click para {libro && removeCurrentImage ? 'cambiar' : 'subir'} imagen
                    </p>
                    <p className="text-xs text-slate-400">
                      JPG, PNG, GIF (max 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {libro?.portada && removeCurrentImage && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  La imagen actual se eliminará al guardar
                </p>
              )}
            </div>
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
              disabled={loading || formData.id_autor === 0}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : libro ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibroModal;

