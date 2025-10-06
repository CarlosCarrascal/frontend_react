import React from 'react';
import type { Autor } from '../types/libro.types';

interface AutorCardProps {
  autor: Autor;
  onEdit?: (autor: Autor) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

const AutorCard: React.FC<AutorCardProps> = ({ autor, onEdit, onDelete, showActions = false }) => {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {autor.nombre.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {autor.nombre}
            </h3>
            <p className="text-sm text-slate-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {autor.pais}
            </p>
          </div>
        </div>
      </div>

      {/* Cantidad de libros */}
      {autor.libros && autor.libros.length > 0 && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center text-slate-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-sm font-medium">
              {autor.libros.length} {autor.libros.length === 1 ? 'libro' : 'libros'}
            </span>
          </div>
          {autor.libros.length > 0 && (
            <ul className="mt-2 ml-7 space-y-1">
              {autor.libros.slice(0, 3).map((libro) => (
                <li key={libro.id_libro} className="text-sm text-slate-600">
                  • {libro.titulo} ({libro.anio})
                </li>
              ))}
              {autor.libros.length > 3 && (
                <li className="text-sm text-slate-500 italic">
                  + {autor.libros.length - 3} más...
                </li>
              )}
            </ul>
          )}
        </div>
      )}

      {/* Acciones */}
      {showActions && (onEdit || onDelete) && (
        <div className="flex gap-2 pt-4 border-t border-slate-200">
          {onEdit && (
            <button
              onClick={() => onEdit(autor)}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(autor.id_autor)}
              className="flex-1 px-4 py-2 text-sm font-medium text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AutorCard;

